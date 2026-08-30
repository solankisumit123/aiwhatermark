import React from 'react';
import { features } from '@/mock';
import {
  Sparkles, Star, Layers, Shield, Image as ImageIcon,
  Bot, ScanSearch, Monitor, Lock,
} from 'lucide-react';

const iconMap = {
  Sparkles, Star, Layers, Shield, Image: ImageIcon, Bot, ScanSearch, Monitor, Lock,
};

const Toolkit = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">
            Complete AI watermark removal toolkit
          </h2>
          <p className="mt-5 text-neutral-500 text-lg">
            Pixel-accurate restoration · batch processing · 100% local · multiple workflow options
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon] || Sparkles;
            return (
              <div key={i} className="flex gap-4 group">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-blue-50 flex items-center justify-center text-neutral-700 group-hover:text-blue-600 transition-colors">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-neutral-900">{f.title}</h3>
                  <p className="mt-2 text-[14.5px] text-neutral-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Toolkit;
