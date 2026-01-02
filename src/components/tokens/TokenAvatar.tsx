'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TokenAvatarProps {
  symbol: string;
  logo?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isNew?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

// Generate consistent colors based on symbol
function getColorFromSymbol(symbol: string): string {
  const colors = [
    'from-red-500 to-red-700',
    'from-blue-500 to-blue-700',
    'from-green-500 to-green-700',
    'from-purple-500 to-purple-700',
    'from-yellow-500 to-yellow-700',
    'from-pink-500 to-pink-700',
    'from-cyan-500 to-cyan-700',
    'from-orange-500 to-orange-700',
    'from-indigo-500 to-indigo-700',
    'from-teal-500 to-teal-700',
  ];
  
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function TokenAvatar({ symbol, logo, size = 'md', className, isNew }: TokenAvatarProps) {
  const [imageError, setImageError] = useState(true); // Default to true since we're using placeholders
  const colorGradient = getColorFromSymbol(symbol);
  
  return (
    <div className="relative">
      <div
        className={cn(
          'relative rounded-lg overflow-hidden flex items-center justify-center font-bold',
          'bg-gradient-to-br',
          colorGradient,
          sizeClasses[size],
          className
        )}
      >
        {!imageError && logo ? (
          <img
            src={logo}
            alt={symbol}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-white drop-shadow-sm">
            {symbol.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {/* Online/Active indicator */}
      <div
        className={cn(
          'absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#161b22]',
          isNew ? 'bg-green-500 pulse-dot' : 'bg-green-500'
        )}
      />
    </div>
  );
}

export default TokenAvatar;

