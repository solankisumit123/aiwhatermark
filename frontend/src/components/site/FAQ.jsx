import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/mock';
import { Sparkles, Github } from 'lucide-react';

export const FAQ = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 text-center">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-12 w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-neutral-200">
              <AccordionTrigger className="text-left text-[16px] font-medium text-neutral-900 py-5 hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] text-neutral-600 leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export const FinalCTA = () => {
  return (
    <section className="bg-gradient-to-b from-[#f5f5f7] to-white py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">
          Ready to remove <span className="text-blue-600">Gemini watermarks</span> for free?
        </h2>
        <p className="mt-5 text-neutral-600 text-lg">
          Open source, browser-local, no sign-up. Start in seconds.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#tool"
            className="inline-flex items-center px-6 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-colors"
          >
            Remove watermarks now
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 h-12 rounded-lg bg-white border border-neutral-200 text-neutral-800 font-medium hover:bg-neutral-50 transition-colors"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 fill-blue-500" strokeWidth={1.5} />
            <span className="font-semibold text-white text-[15px]">GeminiWatermarkRemover.io</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Free Gemini watermark & logo remover. 100% local, pixel-accurate restoration.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Install</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Chrome Extension</a></li>
            <li><a href="#" className="hover:text-white">Userscript</a></li>
            <li><a href="#" className="hover:text-white">CLI</a></li>
            <li><a href="#" className="hover:text-white">Skills</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">More Tools</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Free GPT Image 2</a></li>
            <li><a href="#" className="hover:text-white">Free Image Watermark Remover</a></li>
            <li><a href="#" className="hover:text-white">Video Watermark Remover</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">GitHub</a></li>
            <li><a href="#" className="hover:text-white">Documentation</a></li>
            <li><a href="#" className="hover:text-white">MIT License</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} GeminiWatermarkRemover.io — Open source, MIT licensed.
      </div>
    </footer>
  );
};
