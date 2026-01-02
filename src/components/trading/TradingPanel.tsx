'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Zap, ChevronDown, Info, Loader2 } from 'lucide-react';

interface TradingPanelProps {
  symbol: string;
  price: number;
  isMigrating?: boolean;
  className?: string;
}

export function TradingPanel({ symbol, price, isMigrating = false, className }: TradingPanelProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'adv'>('market');
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const presetAmounts = ['0.1', '0.5', '1', '2', '5'];
  const presets = ['PRESET 1', 'PRESET 2', 'PRESET 3'];

  const stats = {
    bought: 0,
    sold: 0,
    holding: 0,
    pnl: '+0 (+0%)',
  };

  const tokenInfo = {
    tax: '0.25%',
    devHolder: '19.36%',
    devSold: '0%',
    insiderBuyer: '19.28%',
  };

  return (
    <div className={cn('bg-[#0d1117] rounded-lg border border-[#21262d] flex flex-col', className)}>
      {/* Buy/Sell Tabs */}
      <div className="flex border-b border-[#21262d]">
        <button
          onClick={() => setActiveTab('buy')}
          className={cn(
            'flex-1 py-3 text-sm font-medium transition-colors',
            activeTab === 'buy'
              ? 'bg-[#238636] text-white'
              : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]'
          )}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={cn(
            'flex-1 py-3 text-sm font-medium transition-colors',
            activeTab === 'sell'
              ? 'bg-[#da3633] text-white'
              : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]'
          )}
        >
          Sell
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        {/* Order Type Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-[#161b22] rounded-md p-0.5">
            {(['market', 'limit', 'adv'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded transition-colors capitalize',
                  orderType === type
                    ? 'bg-[#30363d] text-[#e6edf3]'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                )}
              >
                {type === 'adv' ? 'Adv.' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8b949e]">
            <span>☐ 1</span>
            <span>☰ 0</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-[#161b22] border-[#30363d] text-[#e6edf3] pr-16 text-lg h-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] text-sm">
              SOL
            </span>
          </div>

          {/* Preset Amounts */}
          <div className="flex gap-1">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAmount(preset);
                  setSelectedPreset(preset);
                }}
                className={cn(
                  'flex-1 py-1.5 text-xs font-medium rounded transition-colors',
                  selectedPreset === preset
                    ? 'bg-[#30363d] text-[#e6edf3]'
                    : 'bg-[#161b22] text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Migration Notice */}
        {isMigrating && (
          <div className="bg-[#161b22] rounded-lg p-3 border border-[#30363d]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-[#8b949e]">›››</span>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="text-xs text-center text-[#8b949e]">
              This pair is currently migrating. This may take up to{' '}
              <span className="text-yellow-400">30 minutes</span>. In the meantime, you can
              still place limit orders, and buy or sell on migration!
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          className={cn(
            'w-full h-11 text-sm font-semibold',
            activeTab === 'buy'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
          )}
        >
          <Zap className="w-4 h-4 mr-2" />
          {activeTab === 'buy' ? `Snipe ${symbol}` : `Sell ${symbol}`}
        </Button>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-[10px] text-[#8b949e]">Bought</div>
            <div className="text-xs text-[#e6edf3] flex items-center justify-center gap-1">
              ☰ <span className="text-cyan-400">{stats.bought}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#8b949e]">Sold</div>
            <div className="text-xs text-[#e6edf3] flex items-center justify-center gap-1">
              ☰ <span className="text-cyan-400">{stats.sold}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#8b949e]">Holding</div>
            <div className="text-xs text-[#e6edf3] flex items-center justify-center gap-1">
              ☰ <span className="text-cyan-400">{stats.holding}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#8b949e]">PnL ⓘ</div>
            <div className="text-xs text-green-400">{stats.pnl}</div>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex gap-1">
          {presets.map((preset, i) => (
            <button
              key={preset}
              className={cn(
                'flex-1 py-2 text-xs font-medium rounded transition-colors',
                i === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#161b22] text-[#8b949e] hover:text-[#e6edf3] border border-[#30363d]'
              )}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Token Info */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#e6edf3]">Token Info</span>
            <ChevronDown className="w-4 h-4 text-[#8b949e]" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Tax %</span>
              <span className="text-green-400">% {tokenInfo.tax}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-red-400 flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-400/20 flex items-center justify-center text-[8px]">★</span>
                {tokenInfo.devHolder}
              </span>
              <span className="text-green-400 flex items-center gap-1">
                <span>◇</span>
                {tokenInfo.devSold}
              </span>
              <span className="text-green-400 flex items-center gap-1">
                <span>⊙</span>
                {tokenInfo.insiderBuyer}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradingPanel;

