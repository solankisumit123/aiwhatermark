// In-browser AI watermark removal engine.
// Two strategies:
// 1. Gemini exact: reverse alpha blending with the calibrated Gemini/Nano Banana
//    alpha maps: original = (watermarked - alpha * logoValue) / (1 - alpha)
// 2. Adaptive: for other AI tools (Sora, Runway, Pika, Kling, Luma, ...) the exact
//    alpha maps are not public, so we estimate a per-pixel alpha of the semi
//    transparent overlay inside known watermark regions, reverse-blend it, and
//    diffusion-inpaint near-opaque logo cores.

import { ALPHA_MAP_BASE64, ALPHA_MAP_LENGTHS } from './geminiAlphaMaps';
import { REGIONS, getTool } from './aiPresets';

const ALPHA_NOISE_FLOOR = 3 / 255;
const ALPHA_THRESHOLD = 2e-3;
const MAX_ALPHA = 0.99;

// ---------- Gemini exact engine ----------

function decodeBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const mapCache = new Map();

function getGeminiMap(key) {
  if (!mapCache.has(key)) {
    const bytes = decodeBase64(ALPHA_MAP_BASE64[key]);
    const view = new Float32Array(bytes.buffer, bytes.byteOffset, ALPHA_MAP_LENGTHS[key]);
    mapCache.set(key, new Float32Array(view));
  }
  return mapCache.get(key);
}

function baseSizeForKey(key) {
  if (key === '36-v2') return 36;
  if (key.startsWith('96')) return 96;
  return 48;
}

function resizeMap(src, srcSize, dstSize) {
  const dst = new Float32Array(dstSize * dstSize);
  const scale = srcSize / dstSize;
  for (let y = 0; y < dstSize; y++) {
    for (let x = 0; x < dstSize; x++) {
      const sx = Math.min(srcSize - 1.001, x * scale);
      const sy = Math.min(srcSize - 1.001, y * scale);
      const x0 = Math.floor(sx), y0 = Math.floor(sy);
      const fx = sx - x0, fy = sy - y0;
      const p00 = src[y0 * srcSize + x0];
      const p10 = src[y0 * srcSize + x0 + 1];
      const p01 = src[(y0 + 1) * srcSize + x0];
      const p11 = src[(y0 + 1) * srcSize + x0 + 1];
      dst[y * dstSize + x] =
        p00 * (1 - fx) * (1 - fy) + p10 * fx * (1 - fy) + p01 * (1 - fx) * fy + p11 * fx * fy;
    }
  }
  return dst;
}

function geminiCandidates(W, H) {
  const list = [
    { size: 48, mR: 32, mB: 32, key: '48' },
    { size: 96, mR: 64, mB: 64, key: '96' },
    { size: 48, mR: 96, mB: 96, key: '48' },
    { size: 96, mR: 192, mB: 192, key: '96-20260520' },
    { size: 36, mR: 96, mB: 96, key: '36-v2' },
    { size: 46, mR: 32, mB: 32, key: '48' },
  ];
  return list.filter((c) => W - c.mR - c.size >= 0 && H - c.mB - c.size >= 0);
}

// Pearson correlation between (signed) alpha map and pixel luminance.
function scoreCandidate(data, rowStride, x, y, map, size) {
  let sa = 0, sl = 0, saa = 0, sll = 0, sal = 0;
  const n = size * size;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const a = map[row * size + col];
      const j = ((y + row) * rowStride + (x + col)) * 4;
      const l = 0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2];
      sa += a;
      sl += l;
      saa += a * a;
      sll += l * l;
      sal += a * l;
    }
  }
  const cov = sal - (sa * sl) / n;
  const va = saa - (sa * sa) / n;
  const vl = sll - (sl * sl) / n;
  if (va <= 1e-9 || vl <= 1e-6) return 0;
  return cov / Math.sqrt(va * vl);
}

function reverseAlphaBlendExact(data, rowStride, x, y, map, size) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const raw = map[row * size + col];
      const mag = Math.abs(raw);
      const signal = Math.max(0, mag - ALPHA_NOISE_FLOOR);
      if (signal < ALPHA_THRESHOLD) continue;
      const alpha = Math.min(mag, MAX_ALPHA);
      const logo = raw < 0 ? 0 : 255;
      const om = 1 - alpha;
      const j = ((y + row) * rowStride + (x + col)) * 4;
      for (let c = 0; c < 3; c++) {
        const original = (data[j + c] - alpha * logo) / om;
        data[j + c] = Math.max(0, Math.min(255, Math.round(original)));
      }
    }
  }
}

const GEMINI_SCORE_THRESHOLD = 0.32;

function tryGeminiExact(ctx, W, H) {
  const candidates = geminiCandidates(W, H);
  if (candidates.length === 0) return false;
  const win = Math.min(304, Math.min(W, H));
  const wx = Math.max(0, W - win);
  const wy = Math.max(0, H - win);
  const ww = W - wx;
  const wh = H - wy;
  const region = ctx.getImageData(wx, wy, ww, wh);
  let best = null;
  for (const cfg of candidates) {
    const base = getGeminiMap(cfg.key);
    const bs = baseSizeForKey(cfg.key);
    const map = cfg.size === bs ? base : resizeMap(base, bs, cfg.size);
    const cx = W - cfg.mR - cfg.size - wx;
    const cy = H - cfg.mB - cfg.size - wy;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x + cfg.size > ww || y + cfg.size > wh) continue;
        const score = scoreCandidate(region.data, ww, x, y, map, cfg.size);
        if (!best || score > best.score) best = { score, map, size: cfg.size, x, y };
      }
    }
  }
  if (!best || best.score < GEMINI_SCORE_THRESHOLD) return false;
  reverseAlphaBlendExact(region.data, ww, best.x, best.y, best.map, best.size);
  ctx.putImageData(region, wx, wy);
  return true;
}

// ---------- Adaptive engine ----------

function boxBlur(src, w, h, r) {
  const tmp = new Float32Array(src.length);
  const dst = new Float32Array(src.length);
  for (let y = 0; y < h; y++) {
    let sum = 0;
    const row = y * w;
    for (let x = -r; x <= r; x++) sum += src[row + Math.max(0, Math.min(w - 1, x))];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = sum / (2 * r + 1);
      sum += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = -r; y <= r; y++) sum += tmp[Math.max(0, Math.min(h - 1, y)) * w + x];
    for (let y = 0; y < h; y++) {
      dst[y * w + x] = sum / (2 * r + 1);
      sum += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return dst;
}

function estimateBackground(lum, w, h) {
  const r = Math.max(6, Math.round(Math.min(w, h) / 6));
  const b1 = boxBlur(lum, w, h, r);
  const n = lum.length;
  const weighted = new Float32Array(n);
  const weights = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const wgt = Math.abs(lum[i] - b1[i]) < 20 ? 1 : 0.05;
    weights[i] = wgt;
    weighted[i] = lum[i] * wgt;
  }
  const bw = boxBlur(weighted, w, h, r);
  const bwt = boxBlur(weights, w, h, r);
  const bg = new Float32Array(n);
  for (let i = 0; i < n; i++) bg[i] = bwt[i] > 1e-6 ? bw[i] / bwt[i] : b1[i];
  return bg;
}

function dilateMask(mask, w, h) {
  const out = new Uint8Array(mask);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (mask[i]) continue;
      if (
        (x > 0 && mask[i - 1]) ||
        (x < w - 1 && mask[i + 1]) ||
        (y > 0 && mask[i - w]) ||
        (y < h - 1 && mask[i + w])
      ) {
        out[i] = 1;
      }
    }
  }
  return out;
}

function diffuseInpaint(data, mask, w, h, iters) {
  const idxs = [];
  for (let i = 0; i < mask.length; i++) if (mask[i]) idxs.push(i);
  if (idxs.length === 0) return;
  for (let it = 0; it < iters; it++) {
    for (const i of idxs) {
      const x = i % w;
      const y = (i / w) | 0;
      let r = 0, g = 0, b = 0, c = 0;
      if (x > 0) { const j = (i - 1) * 4; r += data[j]; g += data[j + 1]; b += data[j + 2]; c++; }
      if (x < w - 1) { const j = (i + 1) * 4; r += data[j]; g += data[j + 1]; b += data[j + 2]; c++; }
      if (y > 0) { const j = (i - w) * 4; r += data[j]; g += data[j + 1]; b += data[j + 2]; c++; }
      if (y < h - 1) { const j = (i + w) * 4; r += data[j]; g += data[j + 1]; b += data[j + 2]; c++; }
      if (c > 0) {
        const j = i * 4;
        data[j] = r / c;
        data[j + 1] = g / c;
        data[j + 2] = b / c;
      }
    }
  }
}

function adaptiveCleanRegion(ctx, W, H, rect) {
  const rx = Math.max(0, Math.round(rect.x * W));
  const ry = Math.max(0, Math.round(rect.y * H));
  const rw = Math.min(W - rx, Math.round(rect.w * W));
  const rh = Math.min(H - ry, Math.round(rect.h * H));
  if (rw < 24 || rh < 24) return false;

  const img = ctx.getImageData(rx, ry, rw, rh);
  const d = img.data;
  const n = rw * rh;
  const lum = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const j = i * 4;
    lum[i] = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
  }

  const bg = estimateBackground(lum, rw, rh);

  const light = new Float32Array(n);
  const dark = new Float32Array(n);
  let lightSum = 0;
  let darkSum = 0;
  for (let i = 0; i < n; i++) {
    const diff = lum[i] - bg[i];
    if (diff > 0) {
      const a = Math.min(diff / Math.max(8, 255 - bg[i]), 0.98);
      light[i] = a;
      if (a > 0.1) lightSum += a;
    } else {
      const a = Math.min(-diff / Math.max(8, bg[i]), 0.98);
      dark[i] = a;
      if (a > 0.1) darkSum += a;
    }
  }

  // A real watermark deviates strongly in ONE direction; texture noise deviates both ways.
  const maxSum = Math.max(lightSum, darkSum);
  const minSum = Math.min(lightSum, darkSum);
  if (maxSum < 1 || (minSum > 0 && maxSum / Math.max(minSum, 0.001) < 1.5)) return false;

  const isLight = lightSum >= darkSum;
  const alpha = boxBlur(isLight ? light : dark, rw, rh, 1);

  let cover = 0;
  let coverAlpha = 0;
  for (let i = 0; i < n; i++) {
    if (alpha[i] < 0.06) alpha[i] = 0;
    if (alpha[i] > 0.14) {
      cover++;
      coverAlpha += alpha[i];
    }
  }
  const coverage = cover / n;
  if (coverage < 0.0025 || coverage > 0.42) return false;
  if (coverAlpha / Math.max(cover, 1) < 0.18) return false;

  const logo = isLight ? 255 : 0;
  let inpaintMask = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const a = Math.min(alpha[i], 0.92);
    if (a <= 0) continue;
    const om = 1 - a;
    const j = i * 4;
    for (let c = 0; c < 3; c++) {
      d[j + c] = Math.max(0, Math.min(255, Math.round((d[j + c] - a * logo) / om)));
    }
    if (alpha[i] > 0.72) inpaintMask[i] = 1;
  }
  inpaintMask = dilateMask(inpaintMask, rw, rh);
  diffuseInpaint(d, inpaintMask, rw, rh, 40);

  ctx.putImageData(img, rx, ry);
  return true;
}

// ---------- Public API ----------

export function cleanCanvas(canvas, toolId = 'auto') {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const W = canvas.width;
  const H = canvas.height;
  const tool = getTool(toolId);
  let applied = 0;
  let method = 'none';

  if (tool.gemini && tryGeminiExact(ctx, W, H)) {
    applied = 1;
    method = 'gemini-exact';
  }

  if (applied === 0) {
    for (const key of tool.regions) {
      if (adaptiveCleanRegion(ctx, W, H, REGIONS[key])) applied++;
    }
    if (applied > 0) method = 'adaptive';
  }

  return { applied: applied > 0, method, regions: applied, tool: tool.id };
}

export async function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = reject;
    img.src = url;
  });
}

export function cleanImageOnCanvas(img, toolId = 'auto') {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  canvas.detection = cleanCanvas(canvas, toolId);
  return canvas;
}

export async function cleanFileToBlob(file, toolId = 'auto') {
  const { img, url } = await loadImage(file);
  try {
    const canvas = cleanImageOnCanvas(img, toolId);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    return { blob, width: canvas.width, height: canvas.height, detection: canvas.detection };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function blobToObjectURL(blob) {
  return URL.createObjectURL(blob);
}
