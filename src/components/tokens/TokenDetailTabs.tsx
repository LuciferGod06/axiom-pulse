'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, EyeOff, Zap, LayoutList, ArrowUpDown } from 'lucide-react';

type TabType = 'trades' | 'positions' | 'orders' | 'holders' | 'topTraders' | 'devTokens';

interface TokenDetailTabsProps {
  symbol: string;
  holdersCount?: number;
  devTokensCount?: number;
  className?: string;
}

interface TradeRow {
  id: string;
  token: string;
  type: 'buy' | 'sell';
  bought: string;
  sold: string;
  remaining: string;
  pnl: string;
  pnlPercent: number;
  time: string;
}

// Mock data
const mockTrades: TradeRow[] = [
  { id: '1', token: 'JUNBO', type: 'buy', bought: '$1,234', sold: '-', remaining: '1,000', pnl: '+$234', pnlPercent: 23.4, time: '2m ago' },
  { id: '2', token: 'JUNBO', type: 'sell', bought: '-', sold: '$500', remaining: '500', pnl: '+$50', pnlPercent: 10, time: '5m ago' },
  { id: '3', token: 'JUNBO', type: 'buy', bought: '$2,000', sold: '-', remaining: '2,000', pnl: '-$100', pnlPercent: -5, time: '10m ago' },
];

const mockHolders = Array.from({ length: 10 }, (_, i) => ({
  id: `holder-${i}`,
  address: `${['0x', ''][Math.floor(Math.random() * 2)]}${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
  balance: `${(Math.random() * 1000000).toFixed(0)}`,
  percentage: (Math.random() * 10).toFixed(2),
  value: `$${(Math.random() * 10000).toFixed(2)}`,
}));

export function TokenDetailTabs({ symbol, holdersCount = 102, devTokensCount = 1, className }: TokenDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('trades');
  const [showHidden, setShowHidden] = useState(false);
  const [showUSD, setShowUSD] = useState(true);

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'trades', label: 'Trades' },
    { id: 'positions', label: 'Positions' },
    { id: 'orders', label: 'Orders' },
    { id: 'holders', label: 'Holders', count: holdersCount },
    { id: 'topTraders', label: 'Top Traders' },
    { id: 'devTokens', label: 'Dev Tokens', count: devTokensCount },
  ];

  return (
    <div className={cn('bg-[#0d1117] rounded-lg border border-[#21262d] flex flex-col', className)}>
      {/* Tab Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#21262d]">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded transition-colors',
                activeTab === tab.id
                  ? 'bg-[#30363d] text-[#e6edf3]'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 text-xs text-[#8b949e]">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHidden(!showHidden)}
            className="text-xs text-[#8b949e] hover:text-[#e6edf3]"
          >
            {showHidden ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1" />}
            Show Hidden
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-[#21262d] border-[#30363d] text-green-400 hover:bg-[#30363d] text-xs"
          >
            <Zap className="w-3.5 h-3.5 mr-1" />
            Instant Trade
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#8b949e] hover:text-[#e6edf3]"
          >
            <LayoutList className="w-3.5 h-3.5 mr-1" />
            Trades Panel
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUSD(!showUSD)}
            className="text-xs text-[#8b949e] hover:text-[#e6edf3]"
          >
            <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
            {showUSD ? 'USD' : 'SOL'}
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'trades' && (
          <Table>
            <TableHeader>
              <TableRow className="border-[#21262d] hover:bg-transparent">
                <TableHead className="text-[#8b949e] font-medium">Token</TableHead>
                <TableHead className="text-[#8b949e] font-medium">Bought</TableHead>
                <TableHead className="text-[#8b949e] font-medium">Sold</TableHead>
                <TableHead className="text-[#8b949e] font-medium">Remaining</TableHead>
                <TableHead className="text-[#8b949e] font-medium">PnL</TableHead>
                <TableHead className="text-[#8b949e] font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-[#8b949e] py-8">
                    No trades yet
                  </TableCell>
                </TableRow>
              ) : (
                mockTrades.map((trade) => (
                  <TableRow key={trade.id} className="border-[#21262d] hover:bg-[#161b22]">
                    <TableCell className="text-[#e6edf3] font-medium">{trade.token}</TableCell>
                    <TableCell className="text-green-400">{trade.bought}</TableCell>
                    <TableCell className="text-red-400">{trade.sold}</TableCell>
                    <TableCell className="text-[#e6edf3]">{trade.remaining}</TableCell>
                    <TableCell className={cn(trade.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400')}>
                      {trade.pnl} ({trade.pnlPercent}%)
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-green-400 hover:bg-green-400/10">
                          Buy
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-red-400 hover:bg-red-400/10">
                          Sell
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {activeTab === 'positions' && (
          <div className="flex items-center justify-center py-12 text-[#8b949e]">
            No positions yet
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="flex items-center justify-center py-12 text-[#8b949e]">
            No pending orders
          </div>
        )}

        {activeTab === 'holders' && (
          <Table>
            <TableHeader>
              <TableRow className="border-[#21262d] hover:bg-transparent">
                <TableHead className="text-[#8b949e] font-medium">#</TableHead>
                <TableHead className="text-[#8b949e] font-medium">Address</TableHead>
                <TableHead className="text-[#8b949e] font-medium">Balance</TableHead>
                <TableHead className="text-[#8b949e] font-medium">%</TableHead>
                <TableHead className="text-[#8b949e] font-medium">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHolders.map((holder, index) => (
                <TableRow key={holder.id} className="border-[#21262d] hover:bg-[#161b22]">
                  <TableCell className="text-[#8b949e]">{index + 1}</TableCell>
                  <TableCell className="text-[#58a6ff] font-mono text-sm">{holder.address}</TableCell>
                  <TableCell className="text-[#e6edf3]">{holder.balance}</TableCell>
                  <TableCell className="text-[#e6edf3]">{holder.percentage}%</TableCell>
                  <TableCell className="text-[#e6edf3]">{holder.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {activeTab === 'topTraders' && (
          <div className="flex items-center justify-center py-12 text-[#8b949e]">
            No top traders data
          </div>
        )}

        {activeTab === 'devTokens' && (
          <div className="flex items-center justify-center py-12 text-[#8b949e]">
            {devTokensCount} dev token(s) found
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenDetailTabs;

