'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, Radio, Zap, BarChart3, User } from 'lucide-react';

interface BottomNavProps {
  activeItem?: string;
}

const navItems = [
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'track', label: 'Track', icon: Radio },
  { id: 'pulse', label: 'Pulse', icon: Zap, active: true },
  { id: 'perpetuals', label: 'Perpetuals', icon: BarChart3 },
  { id: 'account', label: 'Account', icon: User },
];

export function BottomNav({ activeItem = 'pulse' }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1117] border-t border-[#30363d]/50 md:hidden">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;
          
          return (
            <button
              key={item.id}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors',
                isActive ? 'text-[#58a6ff]' : 'text-[#8b949e]'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-[#58a6ff]')} />
              <span className={cn(
                'text-[10px] font-medium',
                isActive && 'text-[#58a6ff]'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;

