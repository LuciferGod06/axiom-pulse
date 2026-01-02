'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Settings,
  Activity,
} from 'lucide-react';

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 border-t border-[#30363d]/50 bg-[#0d1117]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0d1117]/80 z-40">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
          >
            📦 PRESET 1
          </Button>

          <div className="flex items-center gap-1 text-[10px] text-[#8b949e]">
            <span>📊 1</span>
            <span>≡ 0</span>
          </div>

          <div className="h-4 w-px bg-[#30363d]" />

          {/* Quick Links */}
          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                  >
                    <Wallet className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                  Wallet
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                  >
                    <XIcon className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                  Twitter / X
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-[10px] text-[#8b949e]">Discover</span>
            <span className="text-[10px] text-[#58a6ff]">Pulse</span>
            <span className="text-[10px] text-[#8b949e]">PnL</span>
          </div>
        </div>

        {/* Right Section - Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-orange-400">⭕ $89.2K</span>
            <span className="text-yellow-400">💰 $2989</span>
            <span className="text-green-400">💵 $126.06</span>
          </div>

          <div className="h-4 w-px bg-[#30363d]" />

          <div className="flex items-center gap-3 text-[10px] text-[#8b949e]">
            <span>🔷 $51.8K</span>
            <span>⏱ 0.0,32</span>
            <span>≈ 0.003</span>
          </div>

          <div className="h-4 w-px bg-[#30363d]" />

          {/* Connection Status */}
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-green-400 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              Connection is stable
            </span>
          </div>

          <span className="text-[10px] text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded">
            GLOBAL
          </span>

          {/* Settings */}
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                  >
                    <Activity className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                  Activity
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                  Settings
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

