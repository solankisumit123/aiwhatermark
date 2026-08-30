import React from 'react';
import { steps } from '@/mock';

const HowTo = () => {
  return (
    <section className="bg-[#f5f5f7] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 text-center">
          How to remove a Gemini watermark online
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl bg-white p-8 border border-neutral-200/70 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                Step {s.n}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-neutral-900">{s.title}</h3>
              <p className="mt-3 text-[15px] text-neutral-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowTo;
