'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TokenData, SortField, SortDirection, ColumnType } from '@/types/token';
import { TokenCard } from './TokenCard';
import { TokenColumnSkeleton } from './TokenCardSkeleton';
import { FilterModal } from './FilterModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  Clock,
  TrendingUp,
  Wallet,
  Flame,
  BarChart2,
  Radio,
  RefreshCw,
} from 'lucide-react';

interface PriceChange {
  id: string;
  direction: 'up' | 'down' | 'none';
  timestamp: number;
}

interface TokenColumnProps {
  id: ColumnType;
  title: string;
  tokens: TokenData[];
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;
  // Real-time props
  priceChanges?: Map<string, PriceChange>;
  isRealTime?: boolean;
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  lastUpdate?: number | null;
  isRefreshing?: boolean;
}

const sortOptions: { field: SortField; label: string; icon: React.ReactNode }[] = [
  { field: 'age', label: 'Age', icon: <Clock className="w-4 h-4" /> },
  { field: 'marketCap', label: 'Market Cap', icon: <Wallet className="w-4 h-4" /> },
  { field: 'volume', label: 'Volume', icon: <BarChart2 className="w-4 h-4" /> },
  { field: 'txCount', label: 'Transactions', icon: <Flame className="w-4 h-4" /> },
  { field: 'priceChange', label: 'Price Change', icon: <TrendingUp className="w-4 h-4" /> },
];

function parseAge(age: string): number {
  const match = age.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return value;
  }
}

function getTimeAgo(timestamp: number | null | undefined): string {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return 'now';
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m`;
}

export function TokenColumn({
  id,
  title,
  tokens,
  isLoading = false,
  error,
  onRefresh,
  priceChanges,
  isRealTime = false,
  isPaused: externalIsPaused,
  onPause,
  onResume,
  lastUpdate,
  isRefreshing,
}: TokenColumnProps) {
  const [sortField, setSortField] = useState<SortField>('age');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [internalIsPaused, setInternalIsPaused] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Use external pause state if provided, otherwise use internal
  const isPaused = externalIsPaused !== undefined ? externalIsPaused : internalIsPaused;

  const handlePauseToggle = () => {
    if (onPause && onResume) {
      if (isPaused) {
        onResume();
      } else {
        onPause();
      }
    } else {
      setInternalIsPaused(!internalIsPaused);
    }
  };

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'age':
          comparison = parseAge(a.age) - parseAge(b.age);
          break;
        case 'marketCap':
          comparison = a.marketCap - b.marketCap;
          break;
        case 'volume':
          comparison = a.volume - b.volume;
          break;
        case 'txCount':
          comparison = a.txCount - b.txCount;
          break;
        case 'priceChange':
          comparison = a.priceChange - b.priceChange;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tokens, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const columnColors: Record<ColumnType, string> = {
    'new-pairs': 'bg-green-500',
    'final-stretch': 'bg-yellow-500',
    'migrated': 'bg-blue-500',
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-lg border border-[#30363d]/50 md:border">
      {/* Column Header - Hidden on mobile since we use tabs */}
      <div className="hidden md:flex items-center justify-between px-3 py-2 border-b border-[#30363d]/50">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', columnColors[id])} />
          <h2 className="text-sm font-semibold text-[#e6edf3]">{title}</h2>
          <span className="text-xs text-[#8b949e] bg-[#21262d] px-1.5 py-0.5 rounded">
            {tokens.length}
          </span>
          
          {/* Real-time indicator */}
          {isRealTime && (
            <div className="flex items-center gap-1 ml-2">
              <span className={cn(
                'w-1.5 h-1.5 rounded-full',
                isPaused ? 'bg-yellow-500' : isRefreshing ? 'bg-blue-500 animate-pulse' : 'bg-green-500 pulse-dot'
              )} />
              {lastUpdate && (
                <span className="text-[10px] text-[#6e7681]">
                  {getTimeAgo(lastUpdate)}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Priority Filter Buttons */}
          <div className="flex items-center gap-0.5 mr-2">
            {['P1', 'P2', 'P3'].map((priority, i) => (
              <TooltipProvider key={priority} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-xs text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                    >
                      {priority}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                    Priority {i + 1} tokens
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[#161b22] border-[#30363d]"
            >
              <DropdownMenuLabel className="text-[#8b949e] text-xs">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#30363d]" />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.field}
                  className={cn(
                    'text-[#e6edf3] hover:bg-[#21262d] cursor-pointer',
                    sortField === option.field && 'bg-[#21262d]'
                  )}
                  onClick={() => handleSort(option.field)}
                >
                  <span className="flex items-center gap-2 flex-1">
                    {option.icon}
                    {option.label}
                  </span>
                  {sortField === option.field && (
                    sortDirection === 'asc' 
                      ? <ArrowUp className="w-3 h-3" />
                      : <ArrowDown className="w-3 h-3" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Settings */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0 hover:bg-[#21262d] relative",
                    activeFilters > 0 ? "text-cyan-400" : "text-[#8b949e] hover:text-[#e6edf3]"
                  )}
                  onClick={() => setFilterModalOpen(true)}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {activeFilters > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {activeFilters}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                Filter settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        columnType={id}
        onApply={(filters) => {
          // Count active filters
          const count = filters.selectedProtocols.length + 
            (filters.searchKeywords ? 1 : 0) + 
            (filters.excludeKeywords ? 1 : 0);
          setActiveFilters(count);
        }}
      />

      {/* Token List with Vertical Scroll */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-vertical">
        <div className="p-2 space-y-2">
          {isLoading ? (
            <TokenColumnSkeleton count={5} variant="shimmer" />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="text-red-400 text-sm mb-2">Failed to load tokens</div>
              <div className="text-[#8b949e] text-xs text-center mb-4">{error}</div>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          ) : sortedTokens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="text-[#8b949e] text-sm">No tokens found</div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {sortedTokens.map((token, index) => {
                const priceChange = priceChanges?.get(token.id);
                return (
                  <TokenCard
                    key={token.id}
                    token={token}
                    index={index}
                    columnType={id}
                    priceChangeDirection={priceChange?.direction}
                  />
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

export default TokenColumn;
