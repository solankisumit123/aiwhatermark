import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GripVertical } from 'lucide-react';

const CompareSlider = ({ before, after, className = '', beforeLabel = 'Before', afterLabel = 'After', ariaLabel = 'Compare before and after' }) => {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPos((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    };
    const onUp = () => (draggingRef.current = false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [updateFromClientX]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none rounded-xl bg-neutral-100 ${className}`}
      role="group"
      aria-label={ariaLabel}
      onMouseDown={(e) => {
        draggingRef.current = true;
        updateFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        draggingRef.current = true;
        updateFromClientX(e.touches[0].clientX);
      }}
    >
      <img src={after} alt="after" className="block w-full h-full object-cover pointer-events-none" draggable={false} />
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${pos}%` }}
      >
        <img
          src={before}
          alt="before"
          className="block w-full h-full object-cover"
          style={{ width: containerRef.current ? containerRef.current.clientWidth + 'px' : '100%', maxWidth: 'none' }}
          draggable={false}
        />
      </div>

      {/* labels */}
      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-neutral-900/80 text-white text-[11px] font-semibold tracking-wider">{beforeLabel}</span>
      <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-600/90 text-white text-[11px] font-semibold tracking-wider">{afterLabel}</span>

      {/* divider + handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `calc(${pos}% - 1px)` }}
      />
      <button
        type="button"
        aria-label="Drag to compare"
        onMouseDown={(e) => {
          e.stopPropagation();
          draggingRef.current = true;
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          draggingRef.current = true;
        }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center border border-neutral-200 cursor-ew-resize hover:scale-105 transition-transform"
        style={{ left: `${pos}%` }}
      >
        <GripVertical className="w-4 h-4 text-neutral-700" />
      </button>
    </div>
  );
};

export default CompareSlider;
