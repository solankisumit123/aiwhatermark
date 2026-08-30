export const stats = [
  { label: 'Runs in your browser — no upload' },
  { label: '12+ AI generators supported' },
  { label: 'Reverse alpha blending, not AI repaint' },
];

export const steps = [
  {
    n: 1,
    title: 'Pick the AI tool & upload',
    desc: 'Choose Sora, Runway, Pika Labs, Kling AI, Gemini or Auto-Detect, then drag your watermarked images in. Batch supported.',
  },
  {
    n: 2,
    title: 'Auto-remove watermark',
    desc: 'The engine reverses the watermark overlay with alpha blending math to restore original pixels — fully local, no AI guesswork.',
  },
  {
    n: 3,
    title: 'Download clean images',
    desc: 'Compare before/after with the slider, then download lossless PNGs one by one or all together as a ZIP.',
  },
];

export const features = [
  {
    icon: 'Sparkles',
    title: 'Reverse alpha blending, not AI inpainting',
    desc: 'Reconstructs the pixels under the watermark with the exact blend math: original = (watermarked − alpha × logo) / (1 − alpha). No model repaint, no soft edges.',
  },
  {
    icon: 'Bot',
    title: '12+ AI generators supported',
    desc: 'Sora, Runway, Pika Labs, Kling AI, Luma Dream Machine, Bing Image Creator, Adobe Firefly, Leonardo AI, Ideogram, Grok Imagine, Playground AI, Hailuo, Vidu, Meta AI and Gemini.',
  },
  {
    icon: 'ScanSearch',
    title: 'Auto watermark detection',
    desc: 'Adaptive engine estimates the watermark position and per-pixel opacity directly from your image — or pick the AI tool for targeted removal.',
  },
  {
    icon: 'Star',
    title: 'Pixel-exact Gemini / Nano Banana cleanup',
    desc: 'Ships calibrated Gemini alpha maps for every logo size and margin variant, so the star overlay is reversed exactly, pixel for pixel.',
  },
  {
    icon: 'Layers',
    title: 'Bulk processing + ZIP export',
    desc: 'Drop multiple images at once, watch each get cleaned, then download everything as a single ZIP.',
  },
  {
    icon: 'Shield',
    title: '100% browser-local — zero uploads',
    desc: 'All computation stays in your browser. Images never leave your device.',
  },
  {
    icon: 'Image',
    title: 'All formats · all resolutions',
    desc: 'Accepts JPG, PNG, and WebP at any resolution. Exports lossless PNG.',
  },
  {
    icon: 'Monitor',
    title: 'Cross-platform',
    desc: 'Works in every major desktop and mobile browser — nothing to install.',
  },
  {
    icon: 'Lock',
    title: 'Free, no sign-up',
    desc: 'No usage limits, no account, no watermark on your cleaned images.',
  },
];

export const workflows = [
  {
    icon: 'FileVideo',
    title: 'AI video watermark remover',
    desc: 'Remove watermarks from short AI-generated clips locally in the browser — MP4, WebM, and MOV.',
  },
  {
    icon: 'Package',
    title: 'Batch ZIP export',
    desc: 'Clean dozens of images in one go and grab them all in a single ZIP download.',
  },
  {
    icon: 'SlidersHorizontal',
    title: 'Before / after slider',
    desc: 'Drag the comparison handle on every result to verify a pixel-clean removal.',
  },
];

export const faqs = [
  {
    q: 'Which AI watermarks can this remove?',
    a: 'Sora (OpenAI), Runway, Pika Labs, Kling AI, Luma Dream Machine, Bing Image Creator, Adobe Firefly, Leonardo AI, Ideogram, Grok Imagine, Playground AI, Hailuo AI, Vidu, Meta AI, and Gemini / Nano Banana. Auto-Detect scans all common watermark positions.',
  },
  {
    q: 'Is this AI watermark remover completely free?',
    a: 'Yes — completely free, no limits, no sign-up.',
  },
  {
    q: 'Are my photos uploaded to a server?',
    a: 'No. All processing happens locally in your browser — images never leave your device.',
  },
  {
    q: 'How does the watermark removal actually work?',
    a: 'Reverse alpha blending: a watermark is blended as watermarked = alpha × logo + (1 − alpha) × original, so the engine solves for the original pixels. For Gemini we use exact calibrated alpha maps; for other AI tools an adaptive engine estimates the alpha per pixel.',
  },
  {
    q: 'What is the difference between exact and adaptive removal?',
    a: 'Gemini publishes predictable watermark sizes and margins, so removal is pixel-exact. Other generators (Sora, Runway, Pika, ...) vary, so the adaptive engine detects the overlay in known watermark regions, estimates its opacity, reverses the blend and inpaints fully opaque logo cores.',
  },
  {
    q: 'How do I remove a Sora or Runway watermark from an image?',
    a: 'Select Sora or Runway (or leave Auto-Detect), drag the image into the tool, and download the clean PNG. Nothing is uploaded.',
  },
  {
    q: 'Can I bulk remove watermarks?',
    a: 'Yes. Drop multiple files at once and download all cleaned images as a single ZIP.',
  },
  {
    q: 'Can it remove watermarks from videos?',
    a: 'Yes. Use the dedicated AI Video Watermark Remover page for browser-based video cleanup of short clips.',
  },
  {
    q: 'Why is AI inpainting not used?',
    a: 'Inpainting repaints the region with model guesses, which blurs detail and invents content. Reverse alpha blending restores the true pixels that are still present underneath a semi-transparent watermark.',
  },
  {
    q: 'Can it remove every kind of watermark?',
    a: 'It targets visible overlay watermarks from AI generators. Invisible watermarks (like SynthID) and heavily tiled stock-photo watermarks are out of scope.',
  },
];

export const images = {
  heroLeft: 'https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?w=600&q=80',
  heroRight: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?w=600&q=80',
  demoBefore: 'https://images.unsplash.com/photo-1679615845580-8691c78fd7d3?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
  demoAfter: 'https://images.unsplash.com/photo-1711560026656-814d5a9e980f?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
};
