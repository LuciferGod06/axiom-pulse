'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isClosed: boolean;
}

export interface TradeData {
  price: number;
  quantity: number;
  time: number;
  isBuyerMaker: boolean;
}

interface UseWebSocketOptions {
  symbol?: string; // e.g., 'solusdt'
  interval?: string; // e.g., '1m', '5m', '15m', '1h'
  onKline?: (data: KlineData) => void;
  onTrade?: (data: TradeData) => void;
  onPrice?: (price: number) => void;
  enabled?: boolean;
}

// Binance WebSocket streams
const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/ws';

export function useWebSocket({
  symbol = 'solusdt',
  interval = '1m',
  onKline,
  onTrade,
  onPrice,
  enabled = true,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (!enabled) return;

    // Clean up existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      // Connect to combined stream for klines and trades
      const streamUrl = `${BINANCE_WS_BASE}/${symbol.toLowerCase()}@kline_${interval}`;
      
      const ws = new WebSocket(streamUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to Binance');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle kline data
          if (data.e === 'kline') {
            const kline = data.k;
            const klineData: KlineData = {
              time: Math.floor(kline.t / 1000), // Convert to seconds
              open: parseFloat(kline.o),
              high: parseFloat(kline.h),
              low: parseFloat(kline.l),
              close: parseFloat(kline.c),
              volume: parseFloat(kline.v),
              isClosed: kline.x, // Is this kline closed?
            };
            
            setLastPrice(klineData.close);
            onKline?.(klineData);
            onPrice?.(klineData.close);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        setIsConnected(false);
        
        // Reconnect after 3 seconds if not intentionally closed
        if (enabled && event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect();
          }, 3000);
        }
      };
    } catch (e) {
      console.error('Error creating WebSocket:', e);
      setError('Failed to create WebSocket connection');
    }
  }, [symbol, interval, onKline, onTrade, onPrice, enabled]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'Intentional disconnect');
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastPrice,
    error,
    reconnect: connect,
    disconnect,
  };
}

// Hook for getting real-time price only
export function useRealtimePrice(symbol: string = 'solusdt') {
  const [price, setPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const prevPriceRef = useRef<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const streamUrl = `${BINANCE_WS_BASE}/${symbol.toLowerCase()}@ticker`;
    
    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newPrice = parseFloat(data.c); // Current price
        const change = parseFloat(data.P); // Price change percent
        
        setPrice(newPrice);
        setPriceChange(change);
        
        if (prevPriceRef.current !== null) {
          // Calculate instant change for animation
        }
        prevPriceRef.current = newPrice;
      } catch (e) {
        console.error('Error parsing price data:', e);
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return { price, priceChange, isConnected };
}

export default useWebSocket;

