'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TokenData, SortField, SortDirection, FilterOptions } from '@/types/token';

interface UseTokenDataOptions {
  initialData?: TokenData[];
  fetchUrl?: string;
  pollingInterval?: number;
  autoRefresh?: boolean;
}

interface UseTokenDataReturn {
  data: TokenData[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<TokenData[]>>;
  isRefreshing: boolean;
}

export function useTokenData(options: UseTokenDataOptions = {}): UseTokenDataReturn {
  const { 
    initialData = [], 
    fetchUrl, 
    pollingInterval, 
    autoRefresh = true 
  } = options;

  const [data, setData] = useState<TokenData[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      if (fetchUrl) {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } else {
        // Use initial data with a small delay to simulate loading
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(initialData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchUrl, initialData]);

  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    if (autoRefresh) {
      fetchData();
    } else {
      setData(initialData);
      setIsLoading(false);
    }
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    if (pollingInterval && pollingInterval > 0) {
      pollingRef.current = setInterval(() => {
        fetchData(true);
      }, pollingInterval);

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [pollingInterval, fetchData]);

  return { data, isLoading, error, refresh, setData, isRefreshing };
}

// Hook for sorting tokens
export function useSortedTokens(
  tokens: TokenData[],
  defaultField: SortField = 'age',
  defaultDirection: SortDirection = 'asc'
) {
  const [sortField, setSortField] = useState<SortField>(defaultField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultDirection);

  const parseAge = (age: string): number => {
    const match = age.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return 0;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return value;
    }
  };

  const sortedTokens = [...tokens].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'age':
        comparison = parseAge(a.age) - parseAge(b.age);
        break;
      case 'marketCap':
        comparison = a.marketCap - b.marketCap;
        break;
      case 'volume':
        comparison = a.volume - b.volume;
        break;
      case 'txCount':
        comparison = a.txCount - b.txCount;
        break;
      case 'priceChange':
        comparison = a.priceChange - b.priceChange;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortedTokens,
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    toggleSort,
  };
}

// Hook for filtering tokens
export function useFilteredTokens(tokens: TokenData[], filters: FilterOptions) {
  const filteredTokens = tokens.filter(token => {
    if (filters.minMarketCap && token.marketCap < filters.minMarketCap) return false;
    if (filters.maxMarketCap && token.marketCap > filters.maxMarketCap) return false;
    if (filters.minVolume && token.volume < filters.minVolume) return false;
    if (filters.minTx && token.txCount < filters.minTx) return false;
    if (filters.verified !== undefined && token.verified !== filters.verified) return false;
    if (filters.hasAudit !== undefined && token.hasAudit !== filters.hasAudit) return false;
    return true;
  });

  return filteredTokens;
}

export default useTokenData;

