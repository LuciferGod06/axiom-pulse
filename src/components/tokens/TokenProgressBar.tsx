'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TokenProgressBarProps {
  current: number;
  max: number;
  label?: string;
  className?: string;
}

export function TokenProgressBar({ current, max, label, className }: TokenProgressBarProps) {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);
  
  const getColor = () => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-lime-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-1 cursor-default', className)}>
            <div className="w-12 h-1 bg-[#21262d] rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', getColor())}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
          <div className="text-xs">
            <div className="font-semibold">{label || 'Progress'}</div>
            <div className="text-[#8b949e]">{current}/{max} ({percentage.toFixed(0)}%)</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TokenProgressBar;

