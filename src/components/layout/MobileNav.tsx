'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  SlidersHorizontal,
  Bookmark,
  Settings,
  HelpCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Layers,
  Grid3X3,
} from 'lucide-react';

interface MobileNavProps {
  activeTab: 'new-pairs' | 'final-stretch' | 'migrated';
  onTabChange: (tab: 'new-pairs' | 'final-stretch' | 'migrated') => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <div className="md:hidden border-b border-[#30363d]/50 bg-[#0d1117]">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-[#30363d]/30">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
          >
            <Layers className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <Button
            variant={activeTab === 'new-pairs' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'h-7 px-3 text-xs font-medium',
              activeTab === 'new-pairs'
                ? 'bg-[#58a6ff] text-white hover:bg-[#58a6ff]/90'
                : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
            )}
            onClick={() => onTabChange('new-pairs')}
          >
            New Pairs
          </Button>
          <Button
            variant={activeTab === 'final-stretch' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'h-7 px-3 text-xs font-medium',
              activeTab === 'final-stretch'
                ? 'bg-[#58a6ff] text-white hover:bg-[#58a6ff]/90'
                : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
            )}
            onClick={() => onTabChange('final-stretch')}
          >
            Final Stretch
          </Button>
          <Button
            variant={activeTab === 'migrated' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'h-7 px-3 text-xs font-medium',
              activeTab === 'migrated'
                ? 'bg-[#58a6ff] text-white hover:bg-[#58a6ff]/90'
                : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
            )}
            onClick={() => onTabChange('migrated')}
          >
            Migrated
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 gap-1 bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] text-xs px-2"
              >
                <SlidersHorizontal className="w-3 h-3" />
                Display
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#161b22] border-[#30363d]">
              <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
                Default View
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
                Compact View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 gap-1 bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] text-xs px-2"
              >
                <Filter className="w-3 h-3" />
                Filter
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#161b22] border-[#30363d]">
              <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
                All Tokens
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
                Verified Only
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
                High Volume
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-[#30363d]/30">
        <div className="flex items-center gap-2 text-[10px] text-[#8b949e]">
          <span>📊 1</span>
          <span>≡ 0</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#8b949e]">
          <span>↕ 0</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#8b949e]">≡</span>
          <div className="flex items-center gap-0.5">
            {['P1', 'P2', 'P3'].map((p) => (
              <Button
                key={p}
                variant="ghost"
                size="sm"
                className="h-5 px-1.5 text-[10px] text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;

