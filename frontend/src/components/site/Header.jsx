import React from 'react';
import { ChevronDown, Github, Star, Download, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#f5f5f7]/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 group">
            <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600" strokeWidth={1.5} />
            <span className="font-semibold text-[15px] tracking-tight text-neutral-900">
              GeminiWatermarkRemover<span className="text-neutral-500">.io</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-neutral-900 outline-none">
                Tools <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>Chrome Extension</DropdownMenuItem>
                <DropdownMenuItem>Userscript</DropdownMenuItem>
                <DropdownMenuItem>CLI</DropdownMenuItem>
                <DropdownMenuItem>Skills</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <a href="#" className="hover:text-neutral-900">Gemini Video Remover</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-md bg-white border border-neutral-200 text-sm text-neutral-800 hover:bg-neutral-50 transition-colors"
          >
            <Github className="w-4 h-4" />
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-medium">5k Stars</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-3.5 h-9 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Install Chrome Extension</span>
            <span className="sm:hidden">Install</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
