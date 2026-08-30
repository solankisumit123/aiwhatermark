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
1. **Gemini exact**: official npm SDK `@pilio/gemini-watermark-remover` (`removeWatermarkFromImageDataSync`, adaptiveMode:'auto') — maintained engine by userscript author, handles all logo sizes/margins/variants. (Custom in-house alpha map implementation + geminiAlphaMaps.js removed 2026-06, replaced by SDK.)
2. **Adaptive** (other AIs): per preset region (`/app/frontend/src/lib/aiPresets.js` — 16 tools, corner/center region presets) PLUS 4x4 full-frame tile-scan fallback (strict thresholds) for watermarks at any position. Guards: MIN_DIFF=10 absolute lum contrast (fixes dark-bg false positives), dominance ratio (1.5 / 2.0 strict), coverage 0.25%–42% (0.5% strict), mean alpha ≥0.18, compactness gate (bbox ≤55% of region, fill ≥0.12). Reverse blends + diffusion-inpaints near-opaque cores (alpha>0.72, 40 Jacobi iterations).
- API: `cleanFileToBlob(file, toolId)` → `{blob, width, height, detection:{applied, method:'gemini-exact'|'adaptive'|'none', tool}}`; also `cleanCanvas(canvas, toolId)` (used per-frame by video page), `cleanImageOnCanvas`.

## Key Files
- `/app/frontend/src/lib/watermarkCleaner.js` — engine (SDK-backed Gemini path + adaptive multi-AI)
- `/app/frontend/src/lib/aiPresets.js` — AI_TOOLS registry + REGIONS
- `/app/frontend/src/components/site/Hero.jsx` — AI selector chips (data-testid `ai-select-{id}`), dropzone, file input
- `/app/frontend/src/components/site/CleanupPanel.jsx` — result cards, detection badges (exact/adaptive/none), ZIP export
- `/app/frontend/src/components/site/Header.jsx`, `FAQ.jsx` (FinalCTA+Footer), `Toolkit.jsx`, `Workflow.jsx`, `HowTo.jsx`, `mock.js` — rebranded, GitHub/extension removed
- `/app/frontend/src/pages/VideoRemover.jsx` — /video route, uses cleanCanvas per frame

## Implemented (with dates)
- 2026-06 (prev session): Site clone, CompareSlider, batch ZIP, Video route, corner-patch cleaner (replaced)
- 2026-06 (this session): Real Reverse Alpha Blending engine (Gemini exact + adaptive multi-AI), 16-tool selector UI, full rebrand to AI Watermark Remover, GitHub/Chrome-extension sections removed, detection badges, video page upgraded to new engine
- Testing: Node unit validation + testing_agent E2E iteration_1.json (100%) & iteration_2.json (found tile-scan false positive → fixed with MIN_DIFF + compactness gates) → final self-test 8/8: 4 REAL Gemini samples (from official engine test suite, staged at /app/tests/samples/) all exact, adaptive Sora/Runway/non-preset positions pass, plain image correctly untouched
- 2026-06: User uploaded full engine source zip (== npm SDK v1.0.41); official @pilio/gemini-watermark-remover SDK integrated as the Gemini engine; real test samples adopted; full-frame tile scan added so watermarks anywhere are caught

## Backlog
- P1: Per-image progress bar for batch cleaning
- P1: Smarter full-image watermark position search (beyond preset regions)
- P2: JPG/WebP export + quality options
- P2: One-click sample gallery for first-time visitors
- P2: Manual brush/box selection for arbitrary watermark placement
