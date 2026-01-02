'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TokenData } from '@/types/token';

interface PriceChange {
  id: string;
  direction: 'up' | 'down' | 'none';
  timestamp: number;
}

interface UseRealTimeTokensOptions {
  column: 'new-pairs' | 'final-stretch' | 'migrated';
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseRealTimeTokensReturn {
  tokens: TokenData[];
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  priceChanges: Map<string, PriceChange>;
  lastUpdate: number | null;
  refresh: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
}

export function useRealTimeTokens({
  column,
  refreshInterval = 3000, // Default 3 seconds
  enabled = true,
}: UseRealTimeTokensOptions): UseRealTimeTokensReturn {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceChanges, setPriceChanges] = useState<Map<string, PriceChange>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const previousTokensRef = useRef<Map<string, TokenData>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch tokens from API
  const fetchTokens = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`/api/tokens?column=${column}&chain=sol&t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTokens: TokenData[] = await response.json();

      // Calculate price changes
      const newPriceChanges = new Map<string, PriceChange>();
      const previousTokens = previousTokensRef.current;

      newTokens.forEach(token => {
        const previousToken = previousTokens.get(token.id);
        
        if (previousToken) {
          const priceDiff = token.price - previousToken.price;
          if (Math.abs(priceDiff) > 0.000001) {
            newPriceChanges.set(token.id, {
              id: token.id,
              direction: priceDiff > 0 ? 'up' : 'down',
              timestamp: Date.now(),
            });
          }
        }
      });

      // Update previous tokens reference
      previousTokensRef.current = new Map(newTokens.map(t => [t.id, t]));

      // Merge with existing price changes (keep for animation duration)
      setPriceChanges(prev => {
        const merged = new Map(prev);
        const now = Date.now();
        
        // Remove old price changes (older than 2 seconds)
        merged.forEach((change, id) => {
          if (now - change.timestamp > 2000) {
            merged.delete(id);
          }
        });
        
        // Add new price changes
        newPriceChanges.forEach((change, id) => {
          merged.set(id, change);
        });
        
        return merged;
      });

      setTokens(newTokens);
      setLastUpdate(Date.now());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [column]);

  // Initial fetch
  useEffect(() => {
    if (enabled && !isPaused) {
      fetchTokens();
    }
  }, [column, enabled, isPaused]);

  // Set up polling interval
  useEffect(() => {
    if (enabled && !isPaused && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchTokens(true);
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [enabled, isPaused, refreshInterval, fetchTokens]);

  // Manual refresh
  const refresh = useCallback(async () => {
    await fetchTokens(true);
  }, [fetchTokens]);

  // Pause/Resume
  const pause = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {
    tokens,
    isLoading,
    error,
    isRefreshing,
    priceChanges,
    lastUpdate,
    refresh,
    pause,
    resume,
    isPaused,
  };
}

export default useRealTimeTokens;

