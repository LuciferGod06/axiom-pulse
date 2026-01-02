'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TokenData } from '@/types/token';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Copy,
  Users,
  Eye,
  Search,
  Zap,
  Check,
  Flame,
} from 'lucide-react';

interface TokenCardProps {
  token: TokenData;
  index: number;
  columnType?: 'new-pairs' | 'final-stretch' | 'migrated';
  priceChangeDirection?: 'up' | 'down' | 'none';
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${num.toFixed(0)}`;
}

function formatPrice(num: number): string {
  if (num >= 1) return num.toFixed(2);
  if (num >= 0.01) return num.toFixed(3);
  if (num >= 0.0001) return num.toFixed(4);
  // For very small numbers, show subscript notation like 0.0₄1
  const str = num.toFixed(10);
  const match = str.match(/0\.(0+)([1-9]\d*)/);
  if (match) {
    const zeros = match[1].length;
    const significant = match[2].slice(0, 2);
    return `0.0₍${zeros}₎${significant}`;
  }
  return num.toFixed(6);
}

function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function TokenCard({ token, index, columnType, priceChangeDirection }: TokenCardProps) {
  const [copied, setCopied] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);

  // Handle preset amount selection
  const handleAmountSelect = (amount: string) => {
    setBuyAmount(amount);
    setSelectedAmount(amount);
  };

  // Handle custom input change
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyAmount(e.target.value);
    setSelectedAmount(null); // Deselect preset when typing custom
  };

  // Reset amount when dialog closes
  const handleDialogChange = (open: boolean) => {
    setBuyDialogOpen(open);
    if (!open) {
      setBuyAmount('');
      setSelectedAmount(null);
      setIsBuying(false);
    }
  };

  // Handle buy action
  const handleBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) return;
    
    setIsBuying(true);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store purchase in localStorage for wallet display
    const purchases = JSON.parse(localStorage.getItem('axiom_holdings') || '[]');
    purchases.push({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      logo: token.logo,
      amount: parseFloat(buyAmount),
      price: token.price,
      timestamp: Date.now(),
      address: token.address || token.id,
    });
    localStorage.setItem('axiom_holdings', JSON.stringify(purchases));
    
    // Dispatch custom event for wallet update
    window.dispatchEvent(new CustomEvent('holdings-updated'));
    
    setIsBuying(false);
    setBuyDialogOpen(false);
    
    // Show success toast
    toast.success(
      `Successfully bought ${buyAmount} SOL of ${token.symbol}!`,
      {
        description: `Added to your wallet`,
        duration: 4000,
      }
    );
    
    // Reset state
    setBuyAmount('');
    setSelectedAmount(null);
  };

  // Copy FULL address and show toast
  const handleCopy = async (fullAddress: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Get percentage color - green for 0 or low, red for high
  const getPercentColor = (value: number) => {
    if (value === 0) return 'text-green-400';
    if (value <= 5) return 'text-green-400';
    if (value <= 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.15 }}
      className="relative bg-[#0d1117] hover:bg-[#161b22] rounded-lg overflow-hidden cursor-default group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex p-2.5">
        {/* LEFT COLUMN - Avatar only */}
        <div className="flex flex-col items-center shrink-0 mr-2.5">
          {/* Token Avatar - Large */}
          <div className="relative">
            {token.logo ? (
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-20 h-20 rounded-full object-cover border-2 border-axiom-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-purple-600 to-blue-500 flex items-center justify-center border-2 border-[#30363d]">
                <span className="text-white font-bold text-base">
                  {token.symbol.charAt(0)}
                </span>
              </div>
            )}
            {/* Red dot indicator */}
            {token.isNew && (
              <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0d1117]" />
            )}
          </div>
        

        </div>

        {/* RIGHT COLUMN - All content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Row 1: Token Name + Copy | MC & V on right */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-[#e6edf3] text-[14px] truncate">
                {token.symbol}
              </span>
              <span className="text-[#8b949e] text-[13px] truncate">
                {token.name}
              </span>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => handleCopy(token.address || token.id, e)}
                      className="text-[#6e7681] hover:text-[#58a6ff] transition-colors flex-shrink-0"
                    > 
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3] text-xs">
                    {copied ? 'Copied!' : 'Copy address'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Right side - MC & V - LARGER */}
            <div className="text-right flex-shrink-0 leading-snug">
              <div className="text-[16px] text-[#8b949e]">
                MC <span className={cn(
                  'font-bold',
                  priceChangeDirection === 'up' ? 'text-green-400' : 
                  priceChangeDirection === 'down' ? 'text-red-400' : 'text-cyan-400'
                )}>
                  {formatNumber(token.marketCap)}
                </span>
              </div>
              <div className="text-[16px] text-[#8b949e]">
                V <span className="text-[#e6edf3] font-semibold">{formatNumber(token.volume)}</span>
              </div>
            </div>
          </div>

          {/* Row 2: Age badge + icons + holder stats | F price + TX */}
          <div className="flex items-center justify-between gap-2 mt-1.5">
            <div className="flex items-center gap-1.5">
              
              {/* Age Badge */}
              <span className="px-2 py-0.5 rounded text-[12px] font-bold bg-[#238636] text-white">
                {token.age}
              </span>

              {/* Action icons */}
              <div className="flex items-center gap-0.5 text-[#6e7681]">
                <button className="hover:text-[#58a6ff] transition-colors p-0.5">
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Stats with icons - LARGER */}
              <div className="flex items-center gap-2 text-[12px] text-[#8b949e]">
                <span className="flex items-center gap-0.5">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">{token.holders}</span>
                </span>
                <span className="flex items-center gap-0.5">
                  <Flame className="w-4 h-4" />
                  <span className="font-semibold">{token.txCount}</span>
                </span>
                <span className="flex items-center gap-0.5">
                  <Eye className="w-4 h-4" />
                  <span className="font-semibold">{Math.floor(Math.random() * 5)}</span>
                </span>
                <span className="flex items-center gap-0.5 text-yellow-500">
                  <span>🎯</span>
                  <span className="font-semibold">{token.progressPercent ? Math.floor(token.progressPercent / 10) : 0}/10</span>
                </span>
              </div>
            </div>

            {/* F price and TX count - LARGER */}
            <div className="flex items-center gap-2 text-[12px] text-[#8b949e] flex-shrink-0">
              <span>
                F <span className={cn(
                  'font-semibold',
                  priceChangeDirection === 'up' ? 'text-green-400' : 
                  priceChangeDirection === 'down' ? 'text-red-400' : 'text-purple-400'
                )}>≡ {formatPrice(token.price)}</span>
              </span>
              <span>TX <span className="text-[#e6edf3] font-semibold">{token.txCount}</span></span>
            </div>
          </div>

          {/* Row 3: Address | Metric Pills | Buy Button (on hover) */}
          <div className="flex items-center justify-between gap-2 mt-2.5">
              {/* Creator Address - copies FULL address */}
              <button 
              className="flex items-center gap-1 text-[#8b949e] hover:text-[#58a6ff] transition-colors flex-shrink-0"
              onClick={(e) => handleCopy(token.address || token.id, e)}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex-shrink-0" />
              <span className="text-[11px] font-mono">{truncateAddress(token.address || token.id)}</span>
            </button>
            {/* Metric Pills - LARGER */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-center">
              {/* Dev Holder % */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      'px-2 py-1 rounded text-[11px] font-bold bg-[#21262d] whitespace-nowrap',
                      getPercentColor(Math.abs(token.priceChange))
                    )}>
                      {Math.abs(token.priceChange).toFixed(0)}%
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3] text-xs">
                    Dev Holder %
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Dev Sold % + time */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold bg-[#21262d] whitespace-nowrap',
                      getPercentColor(token.devSold)
                    )}>
                      <span>{token.devSold}%</span>
                      <span className="text-[#6e7681] font-normal">{token.age}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3] text-xs">
                    Dev Sold %
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Insider % */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      'px-2 py-1 rounded text-[11px] font-bold bg-[#21262d] whitespace-nowrap',
                      getPercentColor(token.insiderPercent)
                    )}>
                      {token.insiderPercent}%
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3] text-xs">
                    Insider %
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Bundle % */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      'px-2 py-1 rounded text-[11px] font-bold bg-[#21262d] whitespace-nowrap',
                      getPercentColor(token.bundlePercent)
                    )}>
                      {token.bundlePercent}%
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3] text-xs">
                    Bundle %
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Buy Button - Only visible on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="flex-shrink-0"
                >
                  <Button
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white text-[12px] font-bold h-7 px-3 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBuyDialogOpen(true);
                    }}
                  >
                    <Zap className="w-3.5 h-3.5 mr-1" />
                    0 SOL
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent 
          className="bg-[#161b22] border-[#30363d] text-[#e6edf3] max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {token.logo ? (
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#30363d]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center border-2 border-[#30363d]">
                  <span className="text-white font-bold text-lg">{token.symbol.charAt(0)}</span>
                </div>
              )}
              <div>
                <div className="text-lg font-bold">{token.symbol}</div>
                <div className="text-sm font-normal text-[#8b949e]">{token.name}</div>
              </div>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4">
                {/* Token Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#21262d] rounded-lg p-3">
                    <div className="text-xs text-[#8b949e] mb-1">Price</div>
                    <div className="text-lg font-semibold text-cyan-400">
                      ${formatPrice(token.price)}
                    </div>
                  </div>
                  <div className="bg-[#21262d] rounded-lg p-3">
                    <div className="text-xs text-[#8b949e] mb-1">Market Cap</div>
                    <div className="text-lg font-semibold text-[#e6edf3]">
                      {formatNumber(token.marketCap)}
                    </div>
                  </div>
                </div>

                {/* Buy Amount Selection */}
                <div>
                  <div className="text-sm font-medium text-[#e6edf3] mb-2">Select Amount (SOL)</div>
                  <div className="grid grid-cols-4 gap-2">
                    {['0.1', '0.5', '1', '2'].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "text-sm h-10 transition-all",
                          selectedAmount === amount
                            ? "bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-700"
                            : "bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] hover:border-cyan-500"
                        )}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {['5', '10', '25', '50'].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "text-sm h-10 transition-all",
                          selectedAmount === amount
                            ? "bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-700"
                            : "bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] hover:border-cyan-500"
                        )}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Custom amount..."
                    value={buyAmount}
                    onChange={handleCustomAmountChange}
                    className="flex-1 bg-[#21262d] border border-[#30363d] rounded-lg px-3 py-2 text-[#e6edf3] text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <span className="flex items-center text-[#8b949e] text-sm">SOL</span>
                </div>

                {/* Buy Button */}
                <Button
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!buyAmount || parseFloat(buyAmount) <= 0 || isBuying}
                  onClick={handleBuy}
                >
                  {isBuying ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Buy {buyAmount ? `${buyAmount} SOL of ` : ''}{token.symbol}
                    </>
                  )}
                </Button>

                {/* Warning */}
                <p className="text-[10px] text-[#6e7681] text-center">
                  Trading crypto is risky. Only invest what you can afford to lose.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default TokenCard;
