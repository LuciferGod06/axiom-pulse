'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnimatedPriceProps {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
  className?: string;
  showChange?: boolean;
  changeDirection?: 'up' | 'down' | 'none';
  size?: 'sm' | 'md' | 'lg';
}

const defaultFormat = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
  if (value < 0.001) return `$${value.toFixed(4)}`;
  if (value < 1) return `$${value.toFixed(3)}`;
  return `$${value.toFixed(2)}`;
};

const sizeClasses = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

export function AnimatedPrice({
  value,
  prefix = '',
  suffix = '',
  format = defaultFormat,
  className,
  showChange = false,
  changeDirection = 'none',
  size = 'md',
}: AnimatedPriceProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | 'none'>('none');
  const previousValueRef = useRef(value);

  useEffect(() => {
    if (value !== previousValueRef.current) {
      const diff = value - previousValueRef.current;
      setDirection(diff > 0 ? 'up' : diff < 0 ? 'down' : 'none');
      setIsAnimating(true);
      setDisplayValue(value);
      previousValueRef.current = value;

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [value]);

  const effectiveDirection = changeDirection !== 'none' ? changeDirection : direction;

  const getColorClass = () => {
    if (!isAnimating && effectiveDirection === 'none') return 'text-[#e6edf3]';
    if (effectiveDirection === 'up') return 'text-green-400';
    if (effectiveDirection === 'down') return 'text-red-400';
    return 'text-[#e6edf3]';
  };

  const getBackgroundClass = () => {
    if (!isAnimating) return '';
    if (effectiveDirection === 'up') return 'bg-green-500/20';
    if (effectiveDirection === 'down') return 'bg-red-500/20';
    return '';
  };

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-0.5 font-mono transition-colors duration-300 rounded px-0.5',
        sizeClasses[size],
        getColorClass(),
        getBackgroundClass(),
        className
      )}
      animate={{
        scale: isAnimating ? [1, 1.05, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayValue}
          initial={{ opacity: 0, y: effectiveDirection === 'up' ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: effectiveDirection === 'up' ? -10 : 10 }}
          transition={{ duration: 0.2 }}
        >
          {format(displayValue)}
        </motion.span>
      </AnimatePresence>
      {suffix}
      {showChange && isAnimating && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="ml-0.5"
        >
          {effectiveDirection === 'up' ? (
            <TrendingUp className="w-3 h-3 text-green-400" />
          ) : effectiveDirection === 'down' ? (
            <TrendingDown className="w-3 h-3 text-red-400" />
          ) : null}
        </motion.span>
      )}
    </motion.span>
  );
}

// Animated percentage component
interface AnimatedPercentProps {
  value: number;
  className?: string;
  showArrow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedPercent({
  value,
  className,
  showArrow = true,
  size = 'md',
}: AnimatedPercentProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValueRef = useRef(value);

  useEffect(() => {
    if (Math.abs(value - previousValueRef.current) > 0.1) {
      setIsAnimating(true);
      setDisplayValue(value);
      previousValueRef.current = value;

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [value]);

  const isPositive = displayValue >= 0;
  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const bgClass = isAnimating
    ? isPositive
      ? 'bg-green-500/20'
      : 'bg-red-500/20'
    : '';

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-0.5 font-mono rounded px-1 py-0.5 transition-all duration-300',
        sizeClasses[size],
        colorClass,
        bgClass,
        className
      )}
      animate={{
        scale: isAnimating ? [1, 1.1, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {showArrow && (
        isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )
      )}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayValue.toFixed(1)}
          initial={{ opacity: 0, y: isPositive ? 5 : -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isPositive ? -5 : 5 }}
          transition={{ duration: 0.2 }}
        >
          {isPositive ? '+' : ''}{displayValue.toFixed(1)}%
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

export default AnimatedPrice;

