'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Users,
  Flame,
  MessageCircle,
  Eye,
  Target,
  Wallet,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
  className?: string;
}

function StatItem({ icon, value, label, color = 'text-[#8b949e]', className }: StatItemProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-0.5 cursor-default', color, className)}>
            <span className="w-3 h-3">{icon}</span>
            <span className="text-[10px] font-mono-numbers">{value}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-[#21262d] border-[#30363d] text-[#e6edf3] text-xs"
        >
          {label}: {value}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface TokenStatsProps {
  holders: number;
  txCount: number;
  comments?: number;
  views?: number;
  className?: string;
}

export function TokenStats({ holders, txCount, comments = 0, views = 0, className }: TokenStatsProps) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <StatItem
        icon={<Users className="w-3 h-3" />}
        value={holders}
        label="Holders"
      />
      <StatItem
        icon={<Flame className="w-3 h-3" />}
        value={txCount}
        label="Transactions"
      />
      {comments > 0 && (
        <StatItem
          icon={<MessageCircle className="w-3 h-3" />}
          value={comments}
          label="Comments"
        />
      )}
      {views > 0 && (
        <StatItem
          icon={<Eye className="w-3 h-3" />}
          value={views}
          label="Views"
        />
      )}
    </div>
  );
}

interface TokenMetricsProps {
  devSold: number;
  insiderPercent: number;
  bundlePercent: number;
  sniperPercent: number;
  top10Percent: number;
  className?: string;
}

export function TokenMetrics({
  devSold,
  insiderPercent,
  bundlePercent,
  sniperPercent,
  top10Percent,
  className,
}: TokenMetricsProps) {
  const getPercentColor = (value: number, inverse: boolean = false) => {
    if (inverse) {
      if (value <= 10) return 'text-green-400';
      if (value <= 30) return 'text-yellow-400';
      return 'text-red-400';
    }
    if (value >= 70) return 'text-green-400';
    if (value >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={cn('flex items-center gap-2 text-[10px]', className)}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn('flex items-center gap-0.5 cursor-default', getPercentColor(devSold, true))}>
              <Wallet className="w-3 h-3" />
              {devSold}%
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
            Dev Sold: {devSold}%
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn('flex items-center gap-0.5 cursor-default', getPercentColor(insiderPercent, true))}>
              <Target className="w-3 h-3" />
              {insiderPercent}%
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
            Insider: {insiderPercent}%
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn('flex items-center gap-0.5 cursor-default', getPercentColor(bundlePercent, true))}>
              <Shield className="w-3 h-3" />
              {bundlePercent}%
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
            Bundle: {bundlePercent}%
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn('flex items-center gap-0.5 cursor-default', getPercentColor(sniperPercent, true))}>
              <ExternalLink className="w-3 h-3" />
              {sniperPercent}%
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
            Sniper: {sniperPercent}%
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default TokenStats;

