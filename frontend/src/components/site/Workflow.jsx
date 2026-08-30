import React from 'react';
import { workflows } from '@/mock';
import { AppWindow, FileVideo, SquareTerminal, ArrowRight } from 'lucide-react';

const iconMap = { AppWindow, FileVideo, SquareTerminal };

const Workflow = () => {
  return (
    <section className="bg-[#f5f5f7] py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">
            Need another workflow?
          </h2>
          <p className="mt-5 text-neutral-600 text-lg leading-relaxed">
            Pick the path that matches where you already work: Gemini page, video cleanup, terminal, or agent.
          </p>
          <a
            href="#tool"
            className="mt-6 inline-flex items-center gap-1.5 text-neutral-900 font-medium hover:text-blue-600 transition-colors"
          >
            Remove watermark now <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {workflows.map((w, i) => {
            const Icon = iconMap[w.icon];
            return (
              <a
                key={i}
                href="#"
                className="rounded-2xl bg-white p-5 border border-neutral-200/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-neutral-900">{w.title}</h3>
                <p className="mt-2 text-[13px] text-neutral-600 leading-relaxed">{w.desc}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
