'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Search,
  Bell,
  Star,
  Settings,
  ChevronDown,
  Wallet,
  Menu,
  Grid3X3,
  Copy,
  ExternalLink,
  LogOut,
  RefreshCw,
  Briefcase,
  Trash2,
} from 'lucide-react';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  logo?: string;
  amount: number;
  price: number;
  timestamp: number;
  address: string;
}

const navItems = [
  { id: 'discover', label: 'Discover', href: '#' },
  { id: 'pulse', label: 'Pulse', href: '#', active: true },
  { id: 'trackers', label: 'Trackers', href: '#' },
  { id: 'perpetuals', label: 'Perpetuals', href: '#' },
  { id: 'yield', label: 'Yield', href: '#' },
  { id: 'vision', label: 'Vision', href: '#' },
  { id: 'portfolio', label: 'Pc.', href: '#' },
];

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const walletAddress = '8xK4...mN2p';
  const solBalance = 45;

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && isSearchFocused) {
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  // Load holdings from localStorage and listen for updates
  useEffect(() => {
    const loadHoldings = () => {
      const stored = localStorage.getItem('axiom_holdings');
      if (stored) {
        setHoldings(JSON.parse(stored));
      }
    };

    loadHoldings();

    // Listen for holdings updates
    const handleUpdate = () => loadHoldings();
    window.addEventListener('holdings-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('holdings-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Calculate total holdings value
  const totalHoldingsValue = holdings.reduce((sum, h) => sum + (h.amount * h.price), 0);
  const totalHoldingsSOL = holdings.reduce((sum, h) => sum + h.amount, 0);

  // Clear all holdings
  const clearHoldings = () => {
    localStorage.removeItem('axiom_holdings');
    setHoldings([]);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#30363d]/50 bg-[#0d1117]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0d1117]/80 hidden md:block">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-lg" />
              <div className="absolute inset-0.5 bg-[#0d1117] rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </div>
            <span className="text-lg font-bold text-[#e6edf3]">AXIOM</span>
            <span className="text-xs text-[#8b949e] font-medium bg-[#21262d] px-1.5 py-0.5 rounded">
              Pro
            </span>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                item.active
                  ? 'text-[#58a6ff] bg-[#58a6ff]/10'
                  : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className={cn(
            'relative flex items-center transition-all duration-200',
            isSearchFocused && 'ring-1 ring-[#58a6ff] rounded-md'
          )}>
            <Search className="absolute left-3 w-4 h-4 text-[#8b949e]" />
            <Input
              ref={searchInputRef}
              placeholder="Search by token or CA..."
              className={cn(
                'pl-9 pr-8 h-9 bg-[#21262d] border-[#30363d] text-[#e6edf3] text-sm',
                'placeholder:text-[#8b949e] focus-visible:ring-0 focus-visible:border-[#58a6ff]'
              )}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <kbd className="absolute right-3 text-[10px] text-[#8b949e] bg-[#30363d] px-1.5 py-0.5 rounded">
              /
            </kbd>
          </div>
        </div>

        {/* SOL Chain Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] hover:text-[#e6edf3]"
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-blue-500" />
              <span className="text-sm">SOL</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 bg-[#161b22] border-[#30363d]"
          >
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d] cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 mr-2" />
              Solana
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#8b949e] hover:bg-[#21262d] cursor-pointer" disabled>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mr-2" />
              Ethereum (Soon)
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#8b949e] hover:bg-[#21262d] cursor-pointer" disabled>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mr-2" />
              BSC (Soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Deposit Button */}
        <Button
          size="sm"
          className="h-8 bg-[#238636] hover:bg-[#2ea043] text-white font-medium"
        >
          Deposit
        </Button>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
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
                  className="h-8 w-8 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#21262d] border-[#30363d] text-[#e6edf3]">
                Grid View
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Wallet Info */}
        <div className="flex items-center gap-2">
          {/* Holdings/Portfolio */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 gap-1.5 bg-[#21262d] border-[#30363d] hover:bg-[#30363d]",
                  holdings.length > 0 ? "text-cyan-400" : "text-[#e6edf3]"
                )}
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden lg:inline text-sm">
                  {holdings.length > 0 ? `${totalHoldingsSOL.toFixed(2)} SOL` : 'Holdings'}
                </span>
                {holdings.length > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                    {holdings.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 bg-[#161b22] border-[#30363d] p-0"
              align="end"
            >
              <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#e6edf3]">Your Holdings</div>
                  <div className="text-xs text-[#8b949e]">
                    {holdings.length} token{holdings.length !== 1 ? 's' : ''} · {totalHoldingsSOL.toFixed(2)} SOL invested
                  </div>
                </div>
                {holdings.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-[#8b949e] hover:text-red-400 hover:bg-red-400/10"
                    onClick={clearHoldings}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {holdings.length === 0 ? (
                <div className="p-6 text-center">
                  <Briefcase className="w-10 h-10 mx-auto text-[#30363d] mb-2" />
                  <div className="text-sm text-[#8b949e]">No holdings yet</div>
                  <div className="text-xs text-[#6e7681] mt-1">Buy tokens to see them here</div>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto scrollbar-vertical">
                  {holdings.map((holding, idx) => (
                    <div
                      key={`${holding.id}-${holding.timestamp}`}
                      className="flex items-center gap-3 p-3 hover:bg-[#21262d] border-b border-[#30363d]/50 last:border-0"
                    >
                      {/* Token Avatar */}
                      {holding.logo ? (
                        <img
                          src={holding.logo}
                          alt={holding.symbol}
                          className="w-8 h-8 rounded-full object-cover border border-[#30363d]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center border border-[#30363d]">
                          <span className="text-white font-bold text-xs">{holding.symbol.charAt(0)}</span>
                        </div>
                      )}
                      
                      {/* Token Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-[#e6edf3] text-sm">{holding.symbol}</span>
                          <span className="text-[#6e7681] text-xs truncate">{holding.name}</span>
                        </div>
                        <div className="text-xs text-[#8b949e]">
                          {new Date(holding.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {/* Amount */}
                      <div className="text-right">
                        <div className="text-sm font-semibold text-cyan-400">{holding.amount} SOL</div>
                        <div className="text-xs text-[#8b949e]">
                          ${(holding.amount * 198.5).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* SOL Balance */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d]"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-[10px] font-bold text-white">
                  {solBalance}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 bg-[#161b22] border-[#30363d] p-4"
              align="end"
            >
              <div className="space-y-3">
                <div className="text-sm font-semibold text-[#e6edf3]">Wallet Balance</div>
                <div className="flex items-center justify-between py-2 border-b border-[#30363d]">
                  <span className="text-[#8b949e]">SOL</span>
                  <span className="text-[#e6edf3] font-mono">{solBalance}.00</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#30363d]">
                  <span className="text-[#8b949e]">USD Value</span>
                  <span className="text-[#e6edf3] font-mono">$8,932.50</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d]"
                  >
                    Deposit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d]"
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Avatar / Wallet */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-72 bg-[#161b22] border-[#30363d] p-0"
              align="end"
            >
              <div className="p-4 border-b border-[#30363d]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
                  <div>
                    <div className="text-sm font-semibold text-[#e6edf3]">{walletAddress}</div>
                    <div className="text-xs text-[#8b949e]">Connected via Phantom</div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-md">
                  <Copy className="w-4 h-4" />
                  Copy Address
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-md">
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-md">
                  <RefreshCw className="w-4 h-4" />
                  Switch Wallet
                </button>
                <div className="my-1 h-px bg-[#30363d]" />
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#21262d] rounded-md">
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}

export default Header;

