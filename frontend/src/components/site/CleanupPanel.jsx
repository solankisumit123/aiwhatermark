import React, { useMemo, useState } from 'react';
import { Download, Trash2, Loader2, CheckCircle2, Package } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import CompareSlider from './CompareSlider';
import { cleanFileToBlob, blobToObjectURL, fileToDataURL } from '@/lib/watermarkCleaner';
import { toast } from 'sonner';

const CleanupPanel = ({ items, setItems }) => {
  const [zipping, setZipping] = useState(false);

  const completedCount = useMemo(
    () => items.filter((i) => i.status === 'done').length,
    [items]
  );

  const handleDownload = (item) => {
    if (!item.cleanedBlob) return;
    saveAs(item.cleanedBlob, item.name.replace(/\.[^/.]+$/, '') + '-clean.png');
  };

  const handleRemove = (id) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      // revoke URLs from removed item
      const removed = prev.find((i) => i.id === id);
      if (removed?.cleanedURL) URL.revokeObjectURL(removed.cleanedURL);
      return next;
    });
  };

  const handleClearAll = () => {
    items.forEach((i) => i.cleanedURL && URL.revokeObjectURL(i.cleanedURL));
    setItems([]);
  };

  const handleZip = async () => {
    const ready = items.filter((i) => i.status === 'done' && i.cleanedBlob);
    if (ready.length === 0) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      ready.forEach((it) => {
        const base = it.name.replace(/\.[^/.]+$/, '');
        zip.file(`${base}-clean.png`, it.cleanedBlob);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'gemini-watermark-removed.zip');
      toast.success(`Downloaded ${ready.length} clean image${ready.length > 1 ? 's' : ''} as ZIP`);
    } catch (e) {
      toast.error('Failed to build ZIP', { description: String(e) });
    } finally {
      setZipping(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mt-8 mx-auto max-w-5xl text-left">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="text-sm text-neutral-600">
          <span className="font-semibold text-neutral-900">{items.length}</span> image{items.length > 1 ? 's' : ''}{' '}
          <span className="text-neutral-400">·</span>{' '}
          <span className="text-emerald-600 font-medium">{completedCount} cleaned</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearAll}
            className="h-9 px-3 rounded-md text-sm text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
          <button
            onClick={handleZip}
            disabled={completedCount === 0 || zipping}
            className="h-9 px-4 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {zipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
            Download ZIP
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
            <div className="aspect-[4/3] bg-neutral-50 relative">
              {item.status === 'processing' && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              )}
              {item.status === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center text-red-600 text-sm p-4 text-center">
                  {item.error || 'Failed to process image'}
                </div>
              )}
              {item.originalURL && item.cleanedURL ? (
                <CompareSlider
                  before={item.originalURL}
                  after={item.cleanedURL}
                  beforeLabel="WATERMARKED"
                  afterLabel="CLEANED"
                  className="absolute inset-0 rounded-none"
                />
              ) : item.originalURL ? (
                <img src={item.originalURL} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-2 p-3 border-t border-neutral-100">
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                <p className="text-xs text-neutral-500">
                  {item.status === 'done' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Cleaned
                    </span>
                  ) : item.status === 'processing' ? (
                    'Processing…'
                  ) : item.status === 'error' ? (
                    'Error'
                  ) : (
                    'Queued'
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownload(item)}
                  disabled={item.status !== 'done'}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Download PNG"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export async function processFilesSequentially(files, onUpdate) {
  const results = [];
  let idCounter = Date.now();
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const id = String(idCounter++);
    const originalURL = await fileToDataURL(file);
    const item = {
      id,
      name: file.name,
      status: 'processing',
      originalURL,
      cleanedBlob: null,
      cleanedURL: null,
    };
    onUpdate((prev) => [...prev, item]);
    try {
      const { blob } = await cleanFileToBlob(file);
      const cleanedURL = blobToObjectURL(blob);
      onUpdate((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: 'done', cleanedBlob: blob, cleanedURL } : p
        )
      );
      results.push({ id, status: 'done' });
    } catch (e) {
      onUpdate((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'error', error: String(e) } : p))
      );
      results.push({ id, status: 'error' });
    }
  }
  return results;
}

export default CleanupPanel;
