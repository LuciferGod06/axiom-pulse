'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TokenData } from '@/types/token';
import { TokenAvatar } from './TokenAvatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Globe,
  Copy,
  Bell,
  Star,
  Share2,
  ExternalLink,
  Eye,
  Search,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface TokenDetailHeaderProps {
  token: TokenData;
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPrice(num: number): string {
  if (num < 0.001) return `$${num.toFixed(6)}`;
  if (num < 1) return `$${num.toFixed(4)}`;
  return `$${num.toFixed(2)}`;
}

export function TokenDetailHeader({ token, className }: TokenDetailHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token.address || token.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    price: token.price,
    liquidity: token.liquidity,
    supply: '1B',
    globalFeesPaid: 0.021,
    bCurve: 'Migrating',
    tax: '0.25%',
    vol5m: formatNumber(token.volume * 0.1),
    buys: { count: 1, value: formatNumber(token.volume * 0.4) },
    sells: { count: 4, value: formatNumber(token.volume * 0.6) },
    netVol: formatNumber(token.volume * -0.2),
  };

  return (
    <div className={cn('bg-[#0d1117] border-b border-[#21262d]', className)}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Token Info */}
        <div className="flex items-center gap-4">
          {/* Token Avatar */}
          <div className="relative">
            <TokenAvatar
              symbol={token.symbol}
              logo={token.logo}
              size="lg"
              className="w-12 h-12"
            />
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-red-500 rounded text-[8px] text-white font-medium">
              {token.age}
            </div>
          </div>

          {/* Token Name & Links */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#e6edf3]">{token.symbol}</h1>
              <span className="text-sm text-[#8b949e]">{token.name}</span>
              
              {/* Social Links */}
              <div className="flex items-center gap-1 ml-2">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopy}
                        className="p-1 text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                      {copied ? 'Copied!' : 'Copy Address'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {token.hasWebsite && (
                  <button className="p-1 text-[#8b949e] hover:text-[#e6edf3] transition-colors">
                    <Globe className="w-4 h-4" />
                  </button>
                )}
                
                <button className="p-1 text-[#8b949e] hover:text-[#e6edf3] transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                
                <button className="p-1 text-[#8b949e] hover:text-[#e6edf3] transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-bold text-[#e6edf3]">
                {formatNumber(token.marketCap)}
              </span>
              <span className={cn(
                'flex items-center gap-1 text-sm font-medium',
                token.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {token.priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {token.priceChange >= 0 ? '+' : ''}{token.priceChange}%
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex items-center gap-6 ml-8 text-xs">
            <div>
              <div className="text-[#8b949e]">Price</div>
              <div className="text-[#e6edf3] font-medium">{formatPrice(stats.price)}</div>
            </div>
            <div>
              <div className="text-[#8b949e]">Liquidity</div>
              <div className="text-[#e6edf3] font-medium">{formatNumber(stats.liquidity)}</div>
            </div>
            <div>
              <div className="text-[#8b949e]">Supply</div>
              <div className="text-[#e6edf3] font-medium">{stats.supply} ◊</div>
            </div>
            <div>
              <div className="text-[#8b949e]">Global Fees Paid</div>
              <div className="text-[#e6edf3] font-medium">≡ {stats.globalFeesPaid}</div>
            </div>
            <div>
              <div className="text-[#8b949e]">B.Curve</div>
              <div className="text-yellow-400 font-medium">{stats.bCurve}</div>
            </div>
            <div>
              <div className="text-[#8b949e]">Tax</div>
              <div className="text-[#e6edf3] font-medium">{stats.tax}</div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions & Volume Stats */}
        <div className="flex items-center gap-4">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#8b949e] hover:text-[#e6edf3]"
                    onClick={() => setIsStarred(!isStarred)}
                  >
                    <Star className={cn('w-4 h-4', isStarred && 'fill-yellow-400 text-yellow-400')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                  Add to Watchlist
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#8b949e] hover:text-[#e6edf3]"
            >
              <Share2 className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d]"
            >
              <Bell className="w-4 h-4 mr-1" />
              Alert
            </Button>
          </div>

          {/* Volume Stats */}
          <div className="flex items-center gap-4 pl-4 border-l border-[#30363d]">
            <div className="text-xs">
              <div className="text-[#8b949e]">5m Vol</div>
              <div className="text-cyan-400 font-medium">{stats.vol5m}</div>
            </div>
            <div className="text-xs">
              <div className="text-[#8b949e]">Buys</div>
              <div className="text-green-400 font-medium">
                {stats.buys.count} / {stats.buys.value}
              </div>
            </div>
            <div className="text-xs">
              <div className="text-[#8b949e]">Sells</div>
              <div className="text-red-400 font-medium">
                {stats.sells.count} / {stats.sells.value}
              </div>
            </div>
            <div className="text-xs">
              <div className="text-[#8b949e]">Net Vol</div>
              <div className={cn(
                'font-medium',
                token.volume > 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {stats.netVol}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenDetailHeader;

