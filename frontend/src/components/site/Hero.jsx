import React, { useRef, useState } from 'react';
import { Plus, Image as ImageIcon, Video, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { images, stats } from '@/mock';
import { toast } from 'sonner';

const iconFor = (i) => {
  if (i === 0) return <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />;
  if (i === 1) return <Zap className="w-5 h-5" strokeWidth={1.5} />;
  return <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />;
};

const Hero = () => {
  const [tab, setTab] = useState('images');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    toast.success(`${files.length} image(s) ready — cleanup runs locally.`, {
      description: 'This is a UI demo, no actual processing performed.',
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f5f7]">
      {/* subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-blue-100/60 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20">
        {/* Floating hero images */}
        <img
          src={images.heroLeft}
          alt="Watermarked sample"
          className="hidden md:block absolute left-4 top-24 w-56 h-56 object-cover rounded-2xl shadow-2xl ring-4 ring-white -rotate-[8deg] hover:-rotate-6 transition-transform duration-500"
        />
        <img
          src={images.heroRight}
          alt="Cleaned sample"
          className="hidden md:block absolute right-4 top-32 w-56 h-56 object-cover rounded-2xl shadow-2xl ring-4 ring-white rotate-[8deg] hover:rotate-6 transition-transform duration-500"
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.05]">
            Gemini Watermark Remover
          </h1>
          <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
            Free online Gemini watermark cleaner for images, logos, and star overlays.
          </p>
          <p className="mt-1 text-lg text-neutral-600 leading-relaxed">
            No upload, no sign-up — 100% local, private processing.
          </p>

          {/* Tabs */}
          <div className="mt-8 inline-flex items-center rounded-full bg-white shadow-sm border border-neutral-200 p-1">
            <button
              onClick={() => setTab('images')}
              className={`flex items-center gap-2 px-4 h-9 rounded-full text-sm font-medium transition-colors ${
                tab === 'images' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Images
            </button>
            <button
              onClick={() => setTab('videos')}
              className={`flex items-center gap-2 px-4 h-9 rounded-full text-sm font-medium transition-colors ${
                tab === 'videos' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Video className="w-4 h-4" /> Videos
              <Badge className="ml-1 h-4 px-1.5 text-[10px] bg-neutral-200 text-neutral-700 hover:bg-neutral-200 rounded-sm">BETA</Badge>
            </button>
          </div>

          {/* Uploader */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`mt-6 mx-auto max-w-2xl rounded-2xl border-2 border-dashed transition-all bg-white/60 backdrop-blur-sm ${
              dragging ? 'border-blue-500 bg-blue-50/60' : 'border-neutral-300'
            }`}
            style={{
              backgroundImage:
                'linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)',
              backgroundSize: '18px 18px',
              backgroundPosition: '0 0, 0 9px, 9px -9px, -9px 0px',
            }}
          >
            <div className="py-14 px-6 flex flex-col items-center justify-center">
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 px-6 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Start with photos
              </button>
              <p className="mt-3 text-sm text-neutral-500 font-medium">or drag images here</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-neutral-700">
                <div className="text-neutral-500">{iconFor(i)}</div>
                <span className="text-sm font-medium max-w-[180px] text-left">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
