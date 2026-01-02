'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Settings,
  Star,
  TrendingUp,
  HelpCircle,
  Bookmark,
  Grid3X3,
  Volume2,
  VolumeX,
  ChevronDown,
  Layers,
  Zap,
  Filter,
} from 'lucide-react';

export function SubHeader() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]/50 bg-[#0d1117]">
      {/* Left Section - Title & Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-[#e6edf3]">Pulse</h1>
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#21262d]"
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                  Layer View
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#21262d]"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                  Live Updates
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Left Filters */}
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#ffd93d] hover:bg-[#21262d]"
                >
                  <Star className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                Favorites
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                >
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                Trending
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Right Section - Display Options */}
      <div className="flex items-center gap-2">
        {/* Display Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] text-xs"
            >
              <Filter className="w-3 h-3" />
              Display
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 bg-[#161b22] border-[#30363d]"
          >
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d] cursor-pointer">
              Default View
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d] cursor-pointer">
              Compact View
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d] cursor-pointer">
              Detailed View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Action Icons */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
              Bookmarks
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
              Grid Layout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7 w-7 p-0 hover:bg-[#21262d]',
                  soundEnabled ? 'text-[#58a6ff]' : 'text-[#8b949e]'
                )}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
              {soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
              Help
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Column Count Indicator */}
        <div className="flex items-center gap-1 text-xs text-[#8b949e]">
          <span>📊</span>
          <span>1</span>
          <span>≡</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
}

export default SubHeader;

