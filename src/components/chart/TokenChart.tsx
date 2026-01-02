'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, LineStyle, CandlestickSeries, BarSeries, LineSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LineChart,
  BarChart3,
  CandlestickChart,
  ChevronDown,
  Settings2,
  Maximize2,
  Camera,
  RotateCcw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useWebSocket, KlineData } from '@/hooks/useWebSocket';

type ChartType = 'line' | 'bar' | 'candlestick';
type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';

interface TokenChartProps {
  symbol: string;
  basePrice?: number;
  useRealData?: boolean; // Enable WebSocket for real data
  className?: string;
}

// Generate OHLC data based on timeframe
function generateMockData(timeFrame: TimeFrame, basePrice: number = 0.05, count: number = 100) {
  const data = [];
  const now = Math.floor(Date.now() / 1000);
  
  // Time interval in seconds based on timeframe
  const intervals: Record<TimeFrame, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '30m': 1800,
    '1h': 3600,
    '4h': 14400,
    '1d': 86400,
  };
  
  const interval = intervals[timeFrame];
  let currentPrice = basePrice;
  
  // Volatility based on timeframe
  const volatilityMultiplier: Record<TimeFrame, number> = {
    '1m': 0.005,
    '5m': 0.01,
    '15m': 0.015,
    '30m': 0.02,
    '1h': 0.03,
    '4h': 0.05,
    '1d': 0.08,
  };
  
  const volatility = volatilityMultiplier[timeFrame];
  
  for (let i = count; i >= 0; i--) {
    const time = now - i * interval;
    
    const trend = Math.sin(i * 0.1) * 0.02;
    const randomMove = (Math.random() - 0.5) * volatility * currentPrice;
    
    const open = currentPrice;
    const close = currentPrice + randomMove + trend * currentPrice;
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
    
    data.push({
      time: time as any,
      open: Math.max(0.0001, open),
      high: Math.max(0.0001, high),
      low: Math.max(0.0001, low),
      close: Math.max(0.0001, close),
      value: Math.max(0.0001, close),
    });
    
    currentPrice = close;
  }
  
  return data;
}

export function TokenChart({ symbol, basePrice = 0.05, useRealData = true, className }: TokenChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const lastCandleRef = useRef<any>(null);
  
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1m');
  const [priceMode, setPriceMode] = useState<'USD' | 'SOL'>('USD');
  const [showMarketCap, setShowMarketCap] = useState(false);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);
  const [volume24h, setVolume24h] = useState<number>(Math.random() * 500000 + 50000);
  
  const timeFrames: { value: TimeFrame; label: string }[] = [
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '30m', label: '30m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1D' },
  ];

  // Handle incoming kline data from WebSocket
  const handleKlineUpdate = useCallback((kline: KlineData) => {
    if (!seriesRef.current) return;

    const candleData = {
      time: kline.time as any,
      open: kline.open,
      high: kline.high,
      low: kline.low,
      close: kline.close,
    };

    // Determine price direction for animation
    if (livePrice !== null) {
      setPriceDirection(kline.close > livePrice ? 'up' : kline.close < livePrice ? 'down' : null);
    }
    setLivePrice(kline.close);

    // Update the chart
    if (chartType === 'line') {
      seriesRef.current.update({
        time: kline.time as any,
        value: kline.close,
      });
    } else {
      seriesRef.current.update(candleData);
    }

    lastCandleRef.current = candleData;
  }, [chartType, livePrice]);

  // WebSocket connection for real-time data
  const { isConnected, lastPrice } = useWebSocket({
    symbol: 'solusdt',
    interval: timeFrame,
    onKline: handleKlineUpdate,
    enabled: useRealData,
  });

  const chartTypeOptions = [
    { type: 'line' as ChartType, label: 'Line', icon: LineChart },
    { type: 'bar' as ChartType, label: 'Bar', icon: BarChart3 },
    { type: 'candlestick' as ChartType, label: 'Candle', icon: CandlestickChart },
  ];

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0d1117' },
        textColor: '#8b949e',
      },
      grid: {
        vertLines: { color: '#21262d', style: LineStyle.Dotted },
        horzLines: { color: '#21262d', style: LineStyle.Dotted },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#58a6ff',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#58a6ff',
        },
        horzLine: {
          color: '#58a6ff',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#58a6ff',
        },
      },
      rightPriceScale: {
        borderColor: '#30363d',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#30363d',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
      },
      handleScroll: {
        vertTouchDrag: true,
      },
    });

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  // Update series when chart type or timeframe changes
  useEffect(() => {
    if (!chartRef.current) return;

    // Remove existing series safely
    if (seriesRef.current) {
      try {
        chartRef.current.removeSeries(seriesRef.current);
      } catch (e) {
        // Series might already be removed
      }
      seriesRef.current = null;
    }

    // Generate data based on timeframe
    const data = generateMockData(timeFrame, basePrice, 100);

    // Create new series based on chart type
    switch (chartType) {
      case 'candlestick':
        seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
          upColor: '#238636',
          downColor: '#da3633',
          borderUpColor: '#238636',
          borderDownColor: '#da3633',
          wickUpColor: '#238636',
          wickDownColor: '#da3633',
        });
        seriesRef.current.setData(data.map(d => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        })));
        break;
        
      case 'bar':
        seriesRef.current = chartRef.current.addSeries(BarSeries, {
          upColor: '#238636',
          downColor: '#da3633',
        });
        seriesRef.current.setData(data.map(d => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        })));
        break;
        
      case 'line':
        seriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: '#58a6ff',
          lineWidth: 2,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
          crosshairMarkerBorderColor: '#58a6ff',
          crosshairMarkerBackgroundColor: '#0d1117',
        });
        seriesRef.current.setData(data.map(d => ({
          time: d.time,
          value: d.close,
        })));
        break;
    }

    chartRef.current.timeScale().fitContent();
  }, [chartType, timeFrame, basePrice]);

  const handleRefresh = () => {
    // Force re-render with new data
    if (!chartRef.current || !seriesRef.current) return;
    
    const data = generateMockData(timeFrame, basePrice, 100);
    
    if (chartType === 'line') {
      seriesRef.current.setData(data.map(d => ({
        time: d.time,
        value: d.close,
      })));
    } else {
      seriesRef.current.setData(data.map(d => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      })));
    }
    
    chartRef.current.timeScale().fitContent();
  };

  return (
    <div className={cn('flex flex-col bg-[#0d1117] rounded-lg border border-[#21262d]', className)}>
      {/* Chart Header - Token Info */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#21262d]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#e6edf3]">{symbol}/USD</span>
            {isConnected ? (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <Wifi className="w-3 h-3" />
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-[#8b949e]">
                <WifiOff className="w-3 h-3" />
                Offline
              </span>
            )}
          </div>
          <div className="text-xs text-[#8b949e]">
            on Virtual Curve · {timeFrames.find(t => t.value === timeFrame)?.label}
          </div>
          <div className="text-xs text-[#8b949e] ml-4">
            24h Vol: <span className="text-[#e6edf3]">${volume24h >= 1000 ? `${(volume24h / 1000).toFixed(1)}K` : volume24h.toFixed(0)}</span>
          </div>
        </div>
        
        {/* Live Price Display */}
        {livePrice !== null && (
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-lg font-bold transition-colors duration-300',
              priceDirection === 'up' && 'text-green-400',
              priceDirection === 'down' && 'text-red-400',
              priceDirection === null && 'text-[#e6edf3]'
            )}>
              ${livePrice.toFixed(4)}
            </span>
            {priceDirection && (
              <span className={cn(
                'text-xs px-1 py-0.5 rounded',
                priceDirection === 'up' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
              )}>
                {priceDirection === 'up' ? '▲' : '▼'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#21262d]">
        <div className="flex items-center gap-2">
          {/* Time Frame Selector */}
          <div className="flex items-center bg-[#161b22] rounded-md">
            {timeFrames.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeFrame(tf.value)}
                className={cn(
                  'px-2 py-1 text-xs font-medium transition-colors',
                  timeFrame === tf.value
                    ? 'bg-[#30363d] text-[#e6edf3] rounded-md'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Indicators */}
          <Button variant="ghost" size="sm" className="text-xs text-[#8b949e] hover:text-[#e6edf3]">
            <Settings2 className="w-3.5 h-3.5 mr-1" />
            Indicators
          </Button>

          {/* Display Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs text-[#8b949e] hover:text-[#e6edf3]">
                Display Options
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#161b22] border-[#30363d]">
              <DropdownMenuItem className="text-[#e6edf3] focus:bg-[#30363d]">
                Show Volume
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#e6edf3] focus:bg-[#30363d]">
                Show Trades
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#e6edf3] focus:bg-[#30363d]">
                Show Orders
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex items-center bg-[#161b22] rounded-md p-0.5">
            {chartTypeOptions.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  chartType === type
                    ? 'bg-[#30363d] text-[#e6edf3]'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                )}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* USD/SOL Toggle */}
          <div className="flex items-center bg-[#161b22] rounded-md">
            <button
              onClick={() => setPriceMode('USD')}
              className={cn(
                'px-2 py-1 text-xs font-medium transition-colors rounded-l-md',
                priceMode === 'USD'
                  ? 'bg-[#30363d] text-[#e6edf3]'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              )}
            >
              USD
            </button>
            <button
              onClick={() => setPriceMode('SOL')}
              className={cn(
                'px-2 py-1 text-xs font-medium transition-colors rounded-r-md',
                priceMode === 'SOL'
                  ? 'bg-[#30363d] text-[#e6edf3]'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              )}
            >
              SOL
            </button>
          </div>

          {/* MarketCap/Price Toggle */}
          <div className="flex items-center bg-[#161b22] rounded-md">
            <button
              onClick={() => setShowMarketCap(false)}
              className={cn(
                'px-2 py-1 text-xs font-medium transition-colors rounded-l-md',
                !showMarketCap
                  ? 'bg-[#30363d] text-[#e6edf3]'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              )}
            >
              Price
            </button>
            <button
              onClick={() => setShowMarketCap(true)}
              className={cn(
                'px-2 py-1 text-xs font-medium transition-colors rounded-r-md',
                showMarketCap
                  ? 'bg-[#30363d] text-[#e6edf3]'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              )}
            >
              MCap
            </button>
          </div>

          {/* Actions */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-[#8b949e] hover:text-[#e6edf3]"
            onClick={handleRefresh}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#8b949e] hover:text-[#e6edf3]">
            <Camera className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#8b949e] hover:text-[#e6edf3]">
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div ref={chartContainerRef} className="flex-1 min-h-[400px]" />

      {/* Chart Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-[#21262d] text-xs text-[#8b949e]">
        <div className="flex items-center gap-3">
          {timeFrames.slice(0, 4).map(tf => (
            <button 
              key={tf.value}
              onClick={() => setTimeFrame(tf.value)}
              className={cn(
                'hover:text-[#e6edf3] transition-colors',
                timeFrame === tf.value && 'text-[#e6edf3]'
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span>% log auto</span>
        </div>
      </div>
    </div>
  );
}

export default TokenChart;
