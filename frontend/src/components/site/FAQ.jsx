import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/mock';
import { Sparkles } from 'lucide-react';

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
          Ready to remove <span className="text-blue-600">AI watermarks</span> for free?
        </h2>
        <p className="mt-5 text-neutral-600 text-lg">
          Sora, Runway, Pika Labs, Kling AI, Gemini &amp; more. Browser-local, no sign-up.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="/#tool"
            data-testid="final-cta-button"
            className="inline-flex items-center px-6 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-colors"
          >
            Remove watermarks now
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
            <span className="font-semibold text-white text-[15px]">AIWatermarkRemover.io</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Free AI watermark &amp; logo remover for 12+ generators. 100% local, reverse alpha blending.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Tools</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#tool" className="hover:text-white">Image Watermark Remover</a></li>
            <li><a href="/video" className="hover:text-white">Video Watermark Remover</a></li>
            <li><a href="/#tool" className="hover:text-white">Batch ZIP Export</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Supported AI</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#supported" className="hover:text-white">Sora · Runway · Pika Labs</a></li>
            <li><a href="/#supported" className="hover:text-white">Kling AI · Luma · Firefly</a></li>
            <li><a href="/#supported" className="hover:text-white">Leonardo · Ideogram · Grok</a></li>
            <li><a href="/#supported" className="hover:text-white">Gemini · Bing · Playground</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#supported" className="hover:text-white">How it works</a></li>
            <li><a href="/#tool" className="hover:text-white">Get started</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} AIWatermarkRemover.io — 100% browser-local processing.
      </div>
    </footer>
  );
};
