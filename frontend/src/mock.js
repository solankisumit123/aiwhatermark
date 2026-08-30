export const stats = [
  { label: 'Runs in your browser — no upload' },
  { label: '~1s per 1MP image on a laptop' },
  { label: 'Pixel-exact restoration, matches original' },
];

export const steps = [
  {
    n: 1,
    title: 'Upload your photos',
    desc: 'Drag or select watermarked images (JPG, PNG, WebP). Batch supported.',
  },
  {
    n: 2,
    title: 'Auto-remove watermark',
    desc: 'Runs in-browser, reverses the watermark overlay to restore original pixels. Fully local, lossless.',
  },
  {
    n: 3,
    title: 'Download clean images',
    desc: 'Download clean images as lossless PNG — one by one or as a ZIP.',
  },
];

export const features = [
  {
    icon: 'Sparkles',
    title: 'Reverse alpha blending, not AI inpainting',
    desc: 'Uses stronger watermark-region detection and calibrated alpha maps to reconstruct pixels under the watermark — no model repaint, no soft edges.',
  },
  {
    icon: 'Star',
    title: 'Covers Gemini logo, star overlay, Nano Banana',
    desc: 'Handles Gemini logo marks, star overlays, and Nano Banana watermark variants in supported image outputs.',
  },
  {
    icon: 'Layers',
    title: 'Bulk parallel processing',
    desc: 'Drop multiple images, process in parallel in-browser, download individually or as ZIP.',
  },
  {
    icon: 'Shield',
    title: '100% browser-local — zero uploads',
    desc: 'All computation stays in your browser. Images never leave your device.',
  },
  {
    icon: 'Image',
    title: 'All formats · all resolutions',
    desc: 'Accepts JPG, PNG, and WebP input at any Gemini resolution. Exports lossless PNG.',
  },
  {
    icon: 'Chrome',
    title: 'Chrome extension / userscript',
    desc: 'Install once and Gemini pages auto-replace previews, copies, and downloads with clean versions.',
  },
  {
    icon: 'Terminal',
    title: 'CLI & SDK for developers',
    desc: 'pnpm dlx for zero-install runs or install globally. Supports image batches, CI/CD integration, and local video cleanup for .mp4, .webm, and .mov via CLI/SDK.',
  },
  {
    icon: 'Monitor',
    title: 'Cross-platform',
    desc: 'Works on major browsers and mobile. CLI covers Windows, macOS, and Linux.',
  },
  {
    icon: 'Code',
    title: 'Free, open source, no sign-up',
    desc: 'MIT licensed, no usage limits, no account required. 5k+ GitHub Stars.',
  },
];

export const workflows = [
  {
    icon: 'AppWindow',
    title: 'Userscript for Gemini pages',
    desc: 'Keep cleanup inside Gemini. Preview, copy, and download actions automatically use clean images.',
  },
  {
    icon: 'FileVideo',
    title: 'Gemini video watermark remover',
    desc: 'Remove Gemini watermark from video locally in the browser, with a CLI fallback for larger MP4, WebM, and MOV files.',
  },
  {
    icon: 'SquareTerminal',
    title: 'CLI tool',
    desc: 'Built for local image batches, video cleanup, and CI automation',
  },
];

export const faqs = [
  {
    q: 'Is this Gemini watermark remover completely free?',
    a: 'Yes — completely free, no limits, no sign-up. MIT-licensed open source.',
  },
  {
    q: 'Are my photos uploaded to a server?',
    a: 'No. All processing happens locally in your browser — images never leave your device.',
  },
  {
    q: 'How does the watermark removal actually work?',
    a: 'Reverse alpha blending restores the original pixels under the watermark — no AI repaint.',
  },
  {
    q: 'How do I remove a Gemini watermark from an image?',
    a: 'Upload or drag the Gemini image into the online tool, let the local cleaner process it, then download the clean PNG or ZIP. Nothing is uploaded.',
  },
  {
    q: 'Can I use it as a Gemini logo remover online?',
    a: 'Yes. It is built for visible Gemini logo watermarks, star overlays, and supported Nano Banana variants in Gemini-generated images.',
  },
  {
    q: 'Can I bulk remove Gemini watermarks?',
    a: 'Yes. The online tool handles multiple files in parallel. For large batches, use the CLI with --out-dir.',
  },
  {
    q: 'When should I use the CLI?',
    a: 'For large image batches, local video cleanup, CI/CD automation, or scripted workflows.',
  },
  {
    q: 'Can it remove Gemini watermarks from videos?',
    a: 'Yes. Use the dedicated Gemini Video Watermark Remover page for browser-based video cleanup, or the CLI/SDK for larger supported Gemini videos.',
  },
  {
    q: 'Does it work on Nano Banana, star overlay, or other Gemini variants?',
    a: 'Yes — logo, star overlay, and Nano Banana are all supported. If something isn\'t handled, open a GitHub issue.',
  },
  {
    q: 'Is this a general remove watermark from image tool?',
    a: 'No. It is tuned for visible Gemini watermarks. For unrelated watermarks, use a general image editor or a tool made for that source.',
  },
  {
    q: 'Can it remove every kind of watermark?',
    a: 'No. This tool only removes Gemini\'s visible watermark — not SynthID or watermarks from other sources.',
  },
];

export const images = {
  heroLeft: 'https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?w=600&q=80',
  heroRight: 'https://images.unsplash.com/photo-1608501821300-4f99e58bba77?w=600&q=80',
  demoBefore: 'https://images.unsplash.com/photo-1679615845580-8691c78fd7d3?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
  demoAfter: 'https://images.unsplash.com/photo-1711560026656-814d5a9e980f?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
};
