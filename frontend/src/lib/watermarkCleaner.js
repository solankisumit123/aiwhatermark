// Browser-local Gemini watermark cleaner (approximation)
// Strategy: Gemini watermarks live in the bottom-right corner as a small star/logo.
// We (1) sample a clean patch from the region immediately to the LEFT of the
// watermark, (2) copy those pixels into the watermark region, and (3) feather
// a short vertical seam to hide the transition. This is a fast, deterministic,
// content-aware replacement that runs entirely on canvas.

const WATERMARK_REGION = {
  // as a fraction of image dimensions
  widthFrac: 0.14,
  heightFrac: 0.11,
  paddingFrac: 0.008, // small padding around the mark for safety
};

export async function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ img, url });
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function cleanImageOnCanvas(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);

  const W = canvas.width;
  const H = canvas.height;
  const wmW = Math.round(W * WATERMARK_REGION.widthFrac);
  const wmH = Math.round(H * WATERMARK_REGION.heightFrac);
  const pad = Math.round(Math.min(W, H) * WATERMARK_REGION.paddingFrac);

  // Watermark rectangle (bottom-right, with a small inset from the edges)
  const wmX = W - wmW - pad;
  const wmY = H - wmH - pad;

  // Source patch is directly to the LEFT of the watermark, same vertical band.
  const srcX = Math.max(0, wmX - wmW);
  const srcY = wmY;
  const srcW = wmW;
  const srcH = wmH;

  // Copy the source patch over the watermark.
  const patch = ctx.getImageData(srcX, srcY, srcW, srcH);
  ctx.putImageData(patch, wmX, wmY);

  // Feather the vertical seam on the LEFT edge of the pasted patch
  // (mixes original left-of-patch pixels with pasted pixels over `feather` px).
  const feather = Math.max(6, Math.round(wmW * 0.12));
  const seam = ctx.getImageData(wmX - feather, wmY, feather * 2, wmH);
  const data = seam.data;
  const halfW = feather;
  for (let y = 0; y < wmH; y++) {
    for (let x = 0; x < feather * 2; x++) {
      const i = (y * (feather * 2) + x) * 4;
      // t = 0 on far left (original), 1 on far right (patched)
      const t = x / (feather * 2 - 1);
      // Only lightly rebalance near the seam by re-averaging left/right sides.
      if (x < halfW) {
        // untouched original
        continue;
      }
      // Right half was just overwritten by patch; blend a tiny bit with left pixel
      // by averaging with its mirror to smooth any hard vertical line.
      const mirrorX = feather * 2 - 1 - x;
      const j = (y * (feather * 2) + mirrorX) * 4;
      const w = 0.35 * (1 - Math.abs(t - 0.5) * 2); // strongest at seam center
      data[i]     = data[i]     * (1 - w) + data[j]     * w;
      data[i + 1] = data[i + 1] * (1 - w) + data[j + 1] * w;
      data[i + 2] = data[i + 2] * (1 - w) + data[j + 2] * w;
    }
  }
  ctx.putImageData(seam, wmX - feather, wmY);

  return canvas;
}

export async function cleanFileToBlob(file) {
  const { img, url } = await loadImage(file);
  try {
    const canvas = cleanImageOnCanvas(img);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    return { blob, width: canvas.width, height: canvas.height };
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
