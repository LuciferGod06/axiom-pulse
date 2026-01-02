'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Search,
  Menu,
  ChevronDown,
  Copy,
  Clipboard,
  X,
  Wallet,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const solBalance = 45;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#30363d]/50 bg-[#0d1117]/95 backdrop-blur md:hidden">
      <div className="flex h-12 items-center justify-between px-3 gap-2">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-md" />
            <div className="absolute inset-0.5 bg-[#0d1117] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
          </div>
        </div>

        {/* Balance Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] text-xs px-2"
            >
              <span>📊</span>
              <span>≡ 0</span>
              <span className="text-yellow-400">⚡</span>
              <span>0</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-[#161b22] border-[#30363d]">
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
              <Wallet className="w-4 h-4 mr-2" />
              View Portfolio
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
              Deposit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
              Withdraw
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Paste CA Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] text-xs px-2"
        >
          <Clipboard className="w-3 h-3" />
          Paste CA
        </Button>

        {/* Search */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
            >
              <Search className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#161b22] border-[#30363d] top-4 translate-y-0">
            <DialogHeader>
              <DialogTitle className="text-[#e6edf3]">Search</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
              <Input
                placeholder="Search by token or CA..."
                className="pl-9 bg-[#21262d] border-[#30363d] text-[#e6edf3]"
                autoFocus
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Avatar with Badge */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 relative"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] font-bold px-1 rounded-full">
                {solBalance}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-[#161b22] border-[#30363d] p-0" align="end">
            <div className="p-3 border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
                <div>
                  <div className="text-sm font-semibold text-[#e6edf3]">8xK4...mN2p</div>
                  <div className="text-xs text-[#8b949e]">{solBalance} SOL</div>
                </div>
              </div>
            </div>
            <div className="p-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded">
                <Copy className="w-4 h-4" />
                Copy Address
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded">
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#21262d] rounded">
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Menu */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-[#161b22] border-[#30363d]" align="end">
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
              Discover
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#58a6ff] hover:bg-[#21262d]">
              Pulse
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
              Trackers
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
              Perpetuals
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
              Yield
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
              Vision
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#30363d]" />
            <DropdownMenuItem className="text-[#e6edf3] hover:bg-[#21262d]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default MobileHeader;

