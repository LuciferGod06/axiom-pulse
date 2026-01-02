'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  X,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Check,
} from 'lucide-react';

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnType?: 'new-pairs' | 'final-stretch' | 'migrated';
  onApply?: (filters: FilterState) => void;
}

interface FilterState {
  searchKeywords: string;
  excludeKeywords: string;
  selectedProtocols: string[];
  selectedQuoteTokens: string[];
  auditFilters: string[];
  metricsFilters: string[];
  socialsFilters: string[];
}

const protocols = [
  { id: 'pump', name: 'Pump', color: 'bg-green-500' },
  { id: 'mayhem', name: 'Mayhem', color: 'bg-red-500' },
  { id: 'bonk', name: 'Bonk', color: 'bg-yellow-500' },
  { id: 'bags', name: 'Bags', color: 'bg-blue-500' },
  { id: 'moonshot', name: 'Moonshot', color: 'bg-purple-500' },
  { id: 'heaven', name: 'Heaven', color: 'bg-cyan-500' },
  { id: 'daos-fun', name: 'Daos.fun', color: 'bg-pink-500' },
  { id: 'candle', name: 'Candle', color: 'bg-orange-500' },
  { id: 'sugar', name: 'Sugar', color: 'bg-rose-500' },
  { id: 'believe', name: 'Believe', color: 'bg-indigo-500' },
  { id: 'jupiter-studio', name: 'Jupiter Studio', color: 'bg-emerald-500' },
  { id: 'moonit', name: 'Moonit', color: 'bg-violet-500' },
  { id: 'boop', name: 'Boop', color: 'bg-teal-500' },
  { id: 'launchlab', name: 'LaunchLab', color: 'bg-lime-500' },
  { id: 'dynamic-bc', name: 'Dynamic BC', color: 'bg-amber-500' },
];

const quoteTokens = [
  { id: 'sol', name: 'SOL', color: 'bg-gradient-to-r from-purple-500 to-blue-500' },
  { id: 'usdc', name: 'USDC', color: 'bg-blue-500' },
  { id: 'usd1', name: 'USD1', color: 'bg-green-500' },
];

const columnTabs = [
  { id: 'new-pairs', label: 'New Pairs' },
  { id: 'final-stretch', label: 'Final Stretch' },
  { id: 'migrated', label: 'Migrated' },
];

const filterTabs = [
  { id: 'protocols', label: 'Protocols' },
  { id: 'audit', label: 'Audit' },
  { id: 'metrics', label: '$ Metrics' },
  { id: 'socials', label: 'Socials' },
];

export function FilterModal({ open, onOpenChange, columnType = 'new-pairs', onApply }: FilterModalProps) {
  const [activeColumn, setActiveColumn] = useState(columnType);
  const [activeTab, setActiveTab] = useState('protocols');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(['pump']);
  const [selectedQuoteTokens, setSelectedQuoteTokens] = useState<string[]>(['sol', 'usdc', 'usd1']);

  const toggleProtocol = (id: string) => {
    setSelectedProtocols(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleQuoteToken = (id: string) => {
    setSelectedQuoteTokens(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const selectAllProtocols = () => {
    setSelectedProtocols(protocols.map(p => p.id));
  };

  const unselectAllQuoteTokens = () => {
    setSelectedQuoteTokens([]);
  };

  const selectAllQuoteTokens = () => {
    setSelectedQuoteTokens(quoteTokens.map(t => t.id));
  };

  const handleApply = () => {
    onApply?.({
      searchKeywords,
      excludeKeywords,
      selectedProtocols,
      selectedQuoteTokens,
      auditFilters: [],
      metricsFilters: [],
      socialsFilters: [],
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setSearchKeywords('');
    setExcludeKeywords('');
    setSelectedProtocols([]);
    setSelectedQuoteTokens(['sol', 'usdc', 'usd1']);
  };

  const activeFiltersCount = selectedProtocols.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#161b22] border-[#30363d] text-[#e6edf3] max-w-lg p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-[#30363d]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
          </div>
        </DialogHeader>

        {/* Column Tabs */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-[#30363d]">
          {columnTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveColumn(tab.id as typeof activeColumn)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5',
                activeColumn === tab.id
                  ? 'text-[#e6edf3] bg-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
              )}
            >
              {tab.label}
              {tab.id === 'final-stretch' && activeFiltersCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="ml-auto p-1.5 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Search Keywords */}
        <div className="grid grid-cols-2 gap-4 p-4 border-b border-[#30363d]">
          <div>
            <label className="text-xs text-[#8b949e] mb-1.5 block">Search Keywords</label>
            <Input
              placeholder="keyword1, keyword2..."
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              className="h-9 bg-[#21262d] border-[#30363d] text-[#e6edf3] text-sm placeholder:text-[#6e7681]"
            />
          </div>
          <div>
            <label className="text-xs text-[#8b949e] mb-1.5 block">Exclude Keywords</label>
            <Input
              placeholder="keyword1, keyword2..."
              value={excludeKeywords}
              onChange={(e) => setExcludeKeywords(e.target.value)}
              className="h-9 bg-[#21262d] border-[#30363d] text-[#e6edf3] text-sm placeholder:text-[#6e7681]"
            />
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-[#30363d]">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center gap-1.5',
                activeTab === tab.id
                  ? 'text-white bg-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#e6edf3]'
              )}
            >
              {tab.label}
              {tab.id === 'protocols' && selectedProtocols.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] font-bold">
                  {selectedProtocols.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filter Content */}
        <div className="p-4 max-h-[300px] overflow-y-auto scrollbar-vertical">
          <AnimatePresence mode="wait">
            {activeTab === 'protocols' && (
              <motion.div
                key="protocols"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {/* Protocols Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#8b949e]">Protocols</span>
                  <button
                    onClick={selectAllProtocols}
                    className="text-xs text-[#58a6ff] hover:text-[#79b8ff] transition-colors"
                  >
                    Select All
                  </button>
                </div>

                {/* Protocols Grid */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {protocols.map((protocol) => (
                    <button
                      key={protocol.id}
                      onClick={() => toggleProtocol(protocol.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                        selectedProtocols.includes(protocol.id)
                          ? 'bg-[#21262d] border-cyan-500/50 text-[#e6edf3]'
                          : 'bg-transparent border-[#30363d] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]'
                      )}
                    >
                      <div className={cn('w-4 h-4 rounded-full flex items-center justify-center', protocol.color)}>
                        {selectedProtocols.includes(protocol.id) && (
                          <Check className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      <span className="truncate">{protocol.name}</span>
                    </button>
                  ))}
                </div>

                {/* Quote Tokens Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#8b949e]">Quote Tokens</span>
                  <button
                    onClick={selectedQuoteTokens.length > 0 ? unselectAllQuoteTokens : selectAllQuoteTokens}
                    className="text-xs text-[#58a6ff] hover:text-[#79b8ff] transition-colors"
                  >
                    {selectedQuoteTokens.length > 0 ? 'Unselect All' : 'Select All'}
                  </button>
                </div>

                {/* Quote Tokens Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {quoteTokens.map((token) => (
                    <button
                      key={token.id}
                      onClick={() => toggleQuoteToken(token.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                        selectedQuoteTokens.includes(token.id)
                          ? 'bg-[#21262d] border-cyan-500/50 text-[#e6edf3]'
                          : 'bg-transparent border-[#30363d] text-[#8b949e] hover:border-[#484f58] hover:text-[#e6edf3]'
                      )}
                    >
                      <div className={cn('w-4 h-4 rounded-full', token.color)} />
                      <span>{token.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'audit' && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="text-[#8b949e] text-sm">Audit filters coming soon</div>
              </motion.div>
            )}

            {activeTab === 'metrics' && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="text-[#8b949e] text-sm">Metrics filters coming soon</div>
              </motion.div>
            )}

            {activeTab === 'socials' && (
              <motion.div
                key="socials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="text-[#8b949e] text-sm">Socials filters coming soon</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 p-4 border-t border-[#30363d] bg-[#0d1117]">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] h-9"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] h-9"
          >
            <Upload className="w-4 h-4 mr-1.5" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] h-9"
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            Share
          </Button>
          <Button
            size="sm"
            className="ml-auto bg-cyan-600 hover:bg-cyan-700 text-white h-9 px-6 font-semibold"
            onClick={handleApply}
          >
            Apply All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FilterModal;

