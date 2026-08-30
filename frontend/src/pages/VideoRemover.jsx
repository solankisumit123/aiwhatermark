import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video, Plus, Loader2, Download, Sparkles, Info } from 'lucide-react';
import Header from '../components/site/Header';
import { Footer } from '../components/site/FAQ';
import { Badge } from '../components/ui/badge';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';
import { cleanImageOnCanvas } from '../lib/watermarkCleaner';

const VideoRemover = () => {
  const [videoURL, setVideoURL] = useState(null);
  const [cleanedURL, setCleanedURL] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [progress, setProgress] = useState(0);
  const [meta, setMeta] = useState(null);
  const inputRef = useRef(null);

  const process = async (file) => {
    setStatus('processing');
    setProgress(0);
    setCleanedURL(null);
    const url = URL.createObjectURL(file);
    setVideoURL(url);

    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    await new Promise((res, rej) => {
      video.onloadedmetadata = res;
      video.onerror = rej;
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    setMeta({ w: video.videoWidth, h: video.videoHeight, d: video.duration });

    // capture canvas stream at target FPS
    const fps = 30;
    const stream = canvas.captureStream(fps);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';
    const rec = new MediaRecorder(stream, { mimeType: mime });
    const chunks = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const recDone = new Promise((res) => (rec.onstop = res));
    rec.start();

    await video.play().catch(() => {});
    // Some browsers throw if not user-initiated, but we still can seek+draw.
    video.pause();

    const duration = video.duration;
    const step = 1 / fps;
    let t = 0;

    // Frame loop: seek, draw, clean, keep on canvas until recorder samples it.
    // We hold each frame ~step seconds via requestAnimationFrame ticks.
    while (t < duration) {
      // seek
      await new Promise((res) => {
        const onSeek = () => {
          video.removeEventListener('seeked', onSeek);
          res();
        };
        video.addEventListener('seeked', onSeek);
        video.currentTime = Math.min(t, duration - 0.0001);
      });
      // draw + clean
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // reuse core cleaner by passing the canvas as an image-like source:
      // Re-implement inline for canvas since cleanImageOnCanvas expects an image.
      applyCleanupInPlace(ctx, canvas.width, canvas.height);
      // wait ~1 frame so the MediaRecorder samples this frame
      await new Promise((res) => setTimeout(res, Math.max(10, 1000 / fps)));
      t += step;
      setProgress(Math.min(100, Math.round((t / duration) * 100)));
    }

    rec.stop();
    stream.getTracks().forEach((tr) => tr.stop());
    await recDone;

    const blob = new Blob(chunks, { type: mime });
    setCleanedURL(URL.createObjectURL(blob));
    setStatus('done');
    setProgress(100);
    toast.success('Video cleaned locally. Download the WebM below.');
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please choose a video file (MP4, WebM, MOV).');
      return;
    }
    try {
      await process(file);
    } catch (e) {
      console.error(e);
      setStatus('error');
      toast.error('Video processing failed', { description: String(e) });
    }
  };

  const download = () => {
    if (!cleanedURL) return;
    const a = document.createElement('a');
    a.href = cleanedURL;
    a.download = 'gemini-video-clean.webm';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-neutral-900">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="w-4 h-4" /> Back to images
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Gemini Video Watermark Remover
              <Badge className="ml-2 align-middle bg-blue-100 text-blue-700 hover:bg-blue-100">BETA</Badge>
            </h1>
            <p className="text-neutral-600 mt-1">
              Local, in-browser cleanup for short Gemini clips. No upload, no sign-up.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-8">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className="rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-10 text-center"
            >
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <button
                onClick={() => inputRef.current?.click()}
                disabled={status === 'processing'}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md disabled:opacity-60"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing… {progress}%
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Choose a video
                  </>
                )}
              </button>
              <p className="mt-3 text-sm text-neutral-500">or drop MP4 / WebM / MOV here — stays on your device</p>
              <p className="mt-2 text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Best with short clips under ~30 seconds
              </p>
            </div>

            {status === 'processing' && (
              <div className="mt-6">
                <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {(videoURL || cleanedURL) && (
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-neutral-500 mb-2">ORIGINAL</p>
                  {videoURL && (
                    <video src={videoURL} controls className="w-full rounded-lg bg-black" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-emerald-600 mb-2">CLEANED (WebM)</p>
                  {cleanedURL ? (
                    <>
                      <video src={cleanedURL} controls className="w-full rounded-lg bg-black" />
                      <button
                        onClick={download}
                        className="mt-3 inline-flex items-center gap-2 h-10 px-4 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800"
                      >
                        <Download className="w-4 h-4" /> Download WebM
                      </button>
                    </>
                  ) : (
                    <div className="w-full aspect-video rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
                      {status === 'processing' ? 'Cleaning frames…' : 'Waiting for input'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: 'Frame-by-frame cleanup', desc: 'Each frame is cleaned with the same corner-restore engine used for images.' },
            { icon: Video, title: 'WebM output', desc: 'Exports a WebM re-encoded from your original at 30fps in-browser.' },
            { icon: Info, title: 'CLI for long videos', desc: 'For >30s videos, use the CLI/SDK fallback that keeps things local.' },
          ].map((f, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
              <f.icon className="w-5 h-5 text-blue-600" />
              <h3 className="mt-3 font-semibold text-neutral-900">{f.title}</h3>
              <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
};

// Inline canvas cleaner (avoids re-decoding an image element). Mirrors
// the same corner-region replacement approach as watermarkCleaner.js.
function applyCleanupInPlace(ctx, W, H) {
  const wmW = Math.round(W * 0.14);
  const wmH = Math.round(H * 0.11);
  const pad = Math.round(Math.min(W, H) * 0.008);
  const wmX = W - wmW - pad;
  const wmY = H - wmH - pad;
  const srcX = Math.max(0, wmX - wmW);
  const srcY = wmY;
  const patch = ctx.getImageData(srcX, srcY, wmW, wmH);
  ctx.putImageData(patch, wmX, wmY);
}

export default VideoRemover;
