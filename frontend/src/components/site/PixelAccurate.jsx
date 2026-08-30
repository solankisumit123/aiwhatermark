import React from 'react';
import { images } from '@/mock';
import CompareSlider from './CompareSlider';

const PixelAccurate = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
          <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-neutral-100">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            </div>
            <div className="p-4">
              <CompareSlider
                before={images.demoBefore}
                after={images.demoAfter}
                beforeLabel="WATERMARKED"
                afterLabel="RESTORED"
                className="aspect-[4/3]"
              />
              <p className="mt-3 text-xs text-neutral-500 text-center">Drag the handle to compare</p>
            </div>
          </div>
        </div>

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
