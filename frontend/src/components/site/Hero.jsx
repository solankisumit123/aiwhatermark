import React, { useRef, useState } from 'react';
import { Plus, Image as ImageIcon, Video, ShieldCheck, Zap, CheckCircle2, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { images, stats } from '@/mock';
import { AI_TOOLS } from '@/lib/aiPresets';
import { toast } from 'sonner';
import CleanupPanel, { processFilesSequentially } from './CleanupPanel';
import { useNavigate } from 'react-router-dom';

const iconFor = (i) => {
  if (i === 0) return <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />;
  if (i === 1) return <Zap className="w-5 h-5" strokeWidth={1.5} />;
  return <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />;
};

const Hero = () => {
  const [tab, setTab] = useState('images');
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState([]);
  const [tool, setTool] = useState('auto');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const selectedTool = AI_TOOLS.find((t) => t.id === tool) || AI_TOOLS[0];

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) {
      toast.error('Please choose image files (JPG, PNG, WebP).');
      return;
    }
    toast.info(`Cleaning ${list.length} image${list.length > 1 ? 's' : ''} locally (${selectedTool.name})…`);
    await processFilesSequentially(list, setItems, tool);
    toast.success('Done. Drag the slider to compare before/after.');
  };

  return (
    <section id="tool" className="relative overflow-hidden bg-[#f5f5f7]">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-blue-100/60 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20">
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
            AI Watermark Remover
          </h1>
          <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
            Remove watermarks from Sora, Runway, Pika Labs, Kling AI, Luma, Gemini &amp; 10+ more AI generators.
          </p>
          <p className="mt-1 text-lg text-neutral-600 leading-relaxed">
            Reverse alpha blending — no upload, no sign-up, 100% local &amp; private.
          </p>

          <div className="mt-8 inline-flex items-center rounded-full bg-white shadow-sm border border-neutral-200 p-1">
            <button
              data-testid="tab-images"
              onClick={() => setTab('images')}
              className={`flex items-center gap-2 px-4 h-9 rounded-full text-sm font-medium transition-colors ${
                tab === 'images' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Images
            </button>
            <button
              data-testid="tab-videos"
              onClick={() => navigate('/video')}
              className={`flex items-center gap-2 px-4 h-9 rounded-full text-sm font-medium transition-colors text-neutral-500 hover:text-neutral-800`}
            >
              <Video className="w-4 h-4" /> Videos
              <Badge className="ml-1 h-4 px-1.5 text-[10px] bg-neutral-200 text-neutral-700 hover:bg-neutral-200 rounded-sm">BETA</Badge>
            </button>
          </div>

          <div className="mt-6" id="supported">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center justify-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5" /> Select your AI generator
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto" data-testid="ai-tool-selector">
              {AI_TOOLS.map((t) => (
                <button
                  key={t.id}
                  data-testid={`ai-select-${t.id}`}
                  onClick={() => setTool(t.id)}
                  className={`px-3 h-8 rounded-full text-[13px] font-medium border transition-all ${
                    tool === t.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  {t.short}
                </button>
              ))}
            </div>
          </div>

          <div
            data-testid="dropzone"
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
                data-testid="file-input"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <button
                data-testid="start-photos-button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 px-6 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Start with photos
              </button>
              <p className="mt-3 text-sm text-neutral-500 font-medium">
                or drag images here · mode: <span className="text-neutral-700 font-semibold">{selectedTool.name}</span>
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-neutral-700">
                <div className="text-neutral-500">{iconFor(i)}</div>
                <span className="text-sm font-medium max-w-[180px] text-left">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <CleanupPanel items={items} setItems={setItems} />
      </div>
    </section>
  );
};

export default Hero;
