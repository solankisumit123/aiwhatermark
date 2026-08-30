import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#f5f5f7]/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group" data-testid="header-brand-link">
            <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600" strokeWidth={1.5} />
            <span className="font-semibold text-[15px] tracking-tight text-neutral-900">
              AIWatermarkRemover<span className="text-neutral-500">.io</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
            <a href="/#tool" className="hover:text-neutral-900" data-testid="nav-image-remover">Image Remover</a>
            <Link to="/video" className="hover:text-neutral-900" data-testid="nav-video-remover">Video Remover</Link>
            <a href="/#supported" className="hover:text-neutral-900" data-testid="nav-supported-ai">Supported AI</a>
          </nav>
        </div>

        <a
          href="/#tool"
          data-testid="header-cta-button"
          className="flex items-center gap-2 px-3.5 h-9 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Remove Watermark</span>
          <span className="sm:hidden">Remove</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
