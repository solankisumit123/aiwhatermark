import React from 'react';
import { images } from '@/mock';

const PixelAccurate = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left: preview card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm">
          <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="relative">
                <img src={images.demoBefore} alt="Watermarked" className="w-full aspect-square object-cover rounded-lg" />
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-blue-600 text-xs">✱</div>
              </div>
              <img src={images.demoAfter} alt="Restored" className="w-full aspect-square object-cover rounded-lg" />
            </div>
            <div className="px-6 pb-4 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-neutral-900 text-white font-semibold tracking-wider">WATERMARKED</span>
                <span className="text-neutral-500">Before (watermarked)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold tracking-wider">RESTORED</span>
                <span className="text-neutral-500">After cleanup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: text */}
        <div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">
            Pixel-accurate<br />restoration
          </h2>
          <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
            No AI guesswork — stronger watermark detection and reverse alpha blending restore the
            original pixels under the watermark. No repaint, no blur.
          </p>
          <a
            href="#tool"
            className="mt-8 inline-flex items-center px-5 h-11 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Try it free
          </a>
        </div>
      </div>
    </section>
  );
};

export default PixelAccurate;
