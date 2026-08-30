// In-browser AI watermark removal engine.
// Two strategies:
// 1. Gemini exact: the official @pilio/gemini-watermark-remover SDK reverses the
//    watermark with calibrated alpha maps: original = (watermarked - alpha * logo) / (1 - alpha)
// 2. Adaptive: for other AI tools (Sora, Runway, Pika, Kling, Luma, ...) the exact
//    alpha maps are not public, so we estimate a per-pixel alpha of the semi
//    transparent overlay inside known watermark regions, reverse-blend it, and
//    diffusion-inpaint near-opaque logo cores.

import { removeWatermarkFromImageDataSync } from '@pilio/gemini-watermark-remover';
import { REGIONS, getTool } from './aiPresets';

// ---------- Gemini exact engine (official SDK) ----------

function tryGeminiExact(ctx, W, H) {
  try {
    const imageData = ctx.getImageData(0, 0, W, H);
    const { imageData: out, meta } = removeWatermarkFromImageDataSync(imageData, {
      adaptiveMode: 'auto',
    });
    if (!meta?.applied) return false;
    const result =
      typeof ImageData !== 'undefined' && out instanceof ImageData
        ? out
        : new ImageData(out.data, out.width, out.height);
    ctx.putImageData(result, 0, 0);
    return true;
  } catch (e) {
    console.error('Gemini SDK removal failed:', e);
    return false;
  }
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

function adaptiveCleanRegion(ctx, W, H, rect, opts = {}) {
  const minCoverage = opts.strict ? 0.005 : 0.0025;
  const minDominance = opts.strict ? 2.0 : 1.5;
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
  const MIN_DIFF = 10; // absolute lum contrast: rejects blur-bias artifacts on dark/bright backgrounds
  for (let i = 0; i < n; i++) {
    const diff = lum[i] - bg[i];
    if (diff > MIN_DIFF) {
      const a = Math.min(diff / Math.max(8, 255 - bg[i]), 0.98);
      light[i] = a;
      if (a > 0.1) lightSum += a;
    } else if (diff < -MIN_DIFF) {
      const a = Math.min(-diff / Math.max(8, bg[i]), 0.98);
      dark[i] = a;
      if (a > 0.1) darkSum += a;
    }
  }

  // A real watermark deviates strongly in ONE direction; texture noise deviates both ways.
  const maxSum = Math.max(lightSum, darkSum);
  const minSum = Math.min(lightSum, darkSum);
  if (maxSum < 1 || (minSum > 0 && maxSum / Math.max(minSum, 0.001) < minDominance)) return false;

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
  if (coverage < minCoverage || coverage > 0.42) return false;
  if (coverAlpha / Math.max(cover, 1) < 0.18) return false;

  // Compactness gate: a real watermark is localized; gradient/texture skew is
  // spread across the whole tile and must be rejected.
  let minX = rw, minY = rh, maxX = -1, maxY = -1;
  for (let i = 0; i < n; i++) {
    if (alpha[i] > 0.14) {
      const x = i % rw;
      const y = (i / rw) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return false;
  const bboxArea = (maxX - minX + 1) * (maxY - minY + 1);
  if (bboxArea / n > 0.55) return false;
  if (cover / bboxArea < 0.12) return false;

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

// Full-frame tile scan: catches watermarks outside the preset regions
// (e.g. Sora's moving logo, Runway's multi-position text).
function fullScanRects() {
  const rects = [];
  for (let ty = 0; ty < 4; ty++) {
    for (let tx = 0; tx < 4; tx++) {
      rects.push({
        x: Math.max(0, tx * 0.25 - 0.015),
        y: Math.max(0, ty * 0.25 - 0.015),
        w: 0.28,
        h: 0.28,
      });
    }
  }
  return rects;
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
    if (applied === 0) {
      for (const rect of fullScanRects()) {
        if (adaptiveCleanRegion(ctx, W, H, rect, { strict: true })) applied++;
        if (applied >= 3) break;
      }
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
