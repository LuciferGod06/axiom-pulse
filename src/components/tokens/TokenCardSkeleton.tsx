'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TokenCardSkeletonProps {
  variant?: 'default' | 'shimmer';
  className?: string;
}

export function TokenCardSkeleton({ variant = 'default', className }: TokenCardSkeletonProps) {
  const shimmerClass = variant === 'shimmer' ? 'shimmer' : 'bg-[#21262d]';

  return (
    <div className={cn(
      'bg-[#161b22] rounded-lg p-3 border border-[#30363d]/50',
      className
    )}>
      <div className="flex items-start gap-3">
        {/* Avatar Skeleton */}
        <div className="relative">
          <Skeleton className={cn('w-10 h-10 rounded-lg', shimmerClass)} />
          <Skeleton className={cn('absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full', shimmerClass)} />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name Row */}
          <div className="flex items-center gap-2">
            <Skeleton className={cn('h-4 w-16', shimmerClass)} />
            <Skeleton className={cn('h-3 w-24', shimmerClass)} />
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-2">
            <Skeleton className={cn('h-4 w-8 rounded', shimmerClass)} />
            <Skeleton className={cn('h-3 w-3 rounded-full', shimmerClass)} />
            <Skeleton className={cn('h-3 w-3 rounded-full', shimmerClass)} />
            <Skeleton className={cn('h-3 w-3 rounded-full', shimmerClass)} />
            <div className="flex items-center gap-1 ml-auto">
              <Skeleton className={cn('h-3 w-8', shimmerClass)} />
              <Skeleton className={cn('h-3 w-8', shimmerClass)} />
              <Skeleton className={cn('h-3 w-8', shimmerClass)} />
            </div>
          </div>
        </div>

        {/* Price Info Skeleton */}
        <div className="text-right space-y-1 flex-shrink-0">
          <Skeleton className={cn('h-3 w-16 ml-auto', shimmerClass)} />
          <Skeleton className={cn('h-3 w-12 ml-auto', shimmerClass)} />
          <Skeleton className={cn('h-3 w-20 ml-auto', shimmerClass)} />
        </div>

        {/* Button Skeleton */}
        <Skeleton className={cn('h-7 w-16 rounded', shimmerClass)} />
      </div>

      {/* Bottom Row Skeleton */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#30363d]/30">
        <div className="flex items-center gap-2">
          <Skeleton className={cn('w-4 h-4 rounded-full', shimmerClass)} />
          <Skeleton className={cn('h-3 w-20', shimmerClass)} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className={cn('h-3 w-10', shimmerClass)} />
          <Skeleton className={cn('h-3 w-8', shimmerClass)} />
          <Skeleton className={cn('h-3 w-8', shimmerClass)} />
          <Skeleton className={cn('h-3 w-8', shimmerClass)} />
        </div>
      </div>
    </div>
  );
}

interface TokenColumnSkeletonProps {
  count?: number;
  variant?: 'default' | 'shimmer';
}

export function TokenColumnSkeleton({ count = 5, variant = 'shimmer' }: TokenColumnSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <TokenCardSkeleton 
          key={i} 
          variant={variant}
          className={variant === 'shimmer' ? '' : ''} 
        />
      ))}
    </div>
  );
}

export default TokenCardSkeleton;

