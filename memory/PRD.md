# PRD — AI Watermark Remover (formerly Gemini Watermark Remover clone)

## Original Problem Statement
Clone `https://geminiwatermarkremover.io/` (design, layout, colors, structure). Later evolved per user request (June 2026) into a multi-AI watermark remover:
- Real Reverse Alpha Blending engine (no AI inpainting): `original = (watermarked − alpha × logo) / (1 − alpha)`
- Support watermarks from: Sora (OpenAI), Runway, Pika Labs, Kling AI, Luma Dream Machine, Bing Image Creator, Adobe Firefly, Leonardo AI, Ideogram, Grok Imagine, Playground AI, Hailuo, Vidu, Meta AI, Gemini/Nano Banana
- Rebrand site to "AI Watermark Remover"
- Remove GitHub & Chrome Extension sections from UI

## Architecture
- React (CRA) frontend only — 100% client-side canvas processing, NO backend logic used (FastAPI/Mongo template idle)
- All processing local in browser (privacy-first; keep this invariant)

## Engine (`/app/frontend/src/lib/watermarkCleaner.js`)
1. **Gemini exact**: embedded calibrated alpha maps (`/app/frontend/src/lib/geminiAlphaMaps.js`, extracted from user-provided MIT userscript). Candidate configs (logoSize/margins: 48/32, 96/64, 48/96, 96/192, 36/96, 46/32) scored by Pearson correlation (threshold 0.32) with ±2px offset scan in a bottom-right 304px window; reverse alpha blend on best match.
2. **Adaptive** (other AIs): per preset region (`/app/frontend/src/lib/aiPresets.js` — 16 tools, corner/center region presets), estimates background via masked box blur, per-pixel alpha (light/dark polarity with dominance ratio ≥1.5 guard, coverage 0.25%–42%), reverse blends, diffusion-inpaints near-opaque cores (alpha>0.72, 40 Jacobi iterations).
- API: `cleanFileToBlob(file, toolId)` → `{blob, width, height, detection:{applied, method:'gemini-exact'|'adaptive'|'none', tool}}`; also `cleanCanvas(canvas, toolId)` (used per-frame by video page), `cleanImageOnCanvas`.

## Key Files
- `/app/frontend/src/lib/watermarkCleaner.js` — engine
- `/app/frontend/src/lib/geminiAlphaMaps.js` — base64 alpha map data (large, generated)
- `/app/frontend/src/lib/aiPresets.js` — AI_TOOLS registry + REGIONS
- `/app/frontend/src/components/site/Hero.jsx` — AI selector chips (data-testid `ai-select-{id}`), dropzone, file input
- `/app/frontend/src/components/site/CleanupPanel.jsx` — result cards, detection badges (exact/adaptive/none), ZIP export
- `/app/frontend/src/components/site/Header.jsx`, `FAQ.jsx` (FinalCTA+Footer), `Toolkit.jsx`, `Workflow.jsx`, `HowTo.jsx`, `mock.js` — rebranded, GitHub/extension removed
- `/app/frontend/src/pages/VideoRemover.jsx` — /video route, uses cleanCanvas per frame

## Implemented (with dates)
- 2026-06 (prev session): Site clone, CompareSlider, batch ZIP, Video route, corner-patch cleaner (replaced)
- 2026-06 (this session): Real Reverse Alpha Blending engine (Gemini exact + adaptive multi-AI), 16-tool selector UI, full rebrand to AI Watermark Remover, GitHub/Chrome-extension sections removed, detection badges, video page upgraded to new engine
- Testing: Node unit validation (restoration maxErr 2/255, corr 0.95) + testing_agent E2E iteration_1.json → 100% pass

## Backlog
- P1: Per-image progress bar for batch cleaning
- P1: Smarter full-image watermark position search (beyond preset regions)
- P2: JPG/WebP export + quality options
- P2: One-click sample gallery for first-time visitors
- P2: Manual brush/box selection for arbitrary watermark placement
