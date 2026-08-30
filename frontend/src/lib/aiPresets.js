// AI tool presets: where each generator usually stamps its watermark.
// Region rects are fractions of image dimensions.

export const REGIONS = {
  br: { x: 0.6, y: 0.7, w: 0.38, h: 0.28 },
  bl: { x: 0.02, y: 0.7, w: 0.38, h: 0.28 },
  tl: { x: 0.02, y: 0.02, w: 0.38, h: 0.26 },
  tr: { x: 0.6, y: 0.02, w: 0.38, h: 0.26 },
  bc: { x: 0.31, y: 0.72, w: 0.38, h: 0.26 },
  center: { x: 0.3, y: 0.38, w: 0.4, h: 0.24 },
};

export const AI_TOOLS = [
  { id: 'auto', name: 'Auto-Detect', short: 'Auto', regions: ['br', 'bl', 'bc', 'tl', 'tr', 'center'], gemini: true },
  { id: 'gemini', name: 'Gemini / Nano Banana', short: 'Gemini', regions: ['br'], gemini: true },
  { id: 'sora', name: 'Sora (OpenAI)', short: 'Sora', regions: ['bl', 'br', 'tl', 'tr'] },
  { id: 'runway', name: 'Runway', short: 'Runway', regions: ['tl', 'bc', 'center', 'br'] },
  { id: 'pika', name: 'Pika Labs', short: 'Pika', regions: ['bc', 'center', 'br'] },
  { id: 'kling', name: 'Kling AI', short: 'Kling', regions: ['br', 'tl'] },
  { id: 'luma', name: 'Luma Dream Machine', short: 'Luma', regions: ['br', 'bl'] },
  { id: 'bing', name: 'Bing Image Creator', short: 'Bing', regions: ['bl', 'br'] },
  { id: 'firefly', name: 'Adobe Firefly', short: 'Firefly', regions: ['bl', 'br'] },
  { id: 'leonardo', name: 'Leonardo AI', short: 'Leonardo', regions: ['bl', 'br'] },
  { id: 'ideogram', name: 'Ideogram', short: 'Ideogram', regions: ['bl', 'br'] },
  { id: 'grok', name: 'Grok Imagine', short: 'Grok', regions: ['br', 'bl'] },
  { id: 'playground', name: 'Playground AI', short: 'Playground', regions: ['br', 'bc'] },
  { id: 'hailuo', name: 'Hailuo AI', short: 'Hailuo', regions: ['br', 'bl'] },
  { id: 'vidu', name: 'Vidu', short: 'Vidu', regions: ['br', 'bl'] },
  { id: 'meta', name: 'Meta AI', short: 'Meta AI', regions: ['bl', 'br'] },
];

export function getTool(id) {
  return AI_TOOLS.find((t) => t.id === id) || AI_TOOLS[0];
}
