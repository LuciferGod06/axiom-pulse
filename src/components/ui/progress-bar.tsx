'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  default: 'bg-[#58a6ff]',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

export function ProgressBar({
  value,
  max = 100,
  size = 'sm',
  showLabel = false,
  variant = 'default',
  animated = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Determine variant based on percentage if using default
  const getVariantClass = () => {
    if (variant !== 'default') return variantClasses[variant];
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'flex-1 bg-[#21262d] rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            getVariantClass(),
            animated && 'progress-animate'
          )}
          style={{ 
            width: `${percentage}%`,
            '--progress': `${percentage}%` 
          } as React.CSSProperties}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-[#8b949e] font-mono min-w-[3ch]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

export default ProgressBar;

