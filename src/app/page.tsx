'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, SubHeader, Footer, MobileHeader, MobileNav, BottomNav } from '@/components/layout';
import { TokenColumn, TokenColumnSkeleton } from '@/components/tokens';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useRealTimeTokens } from '@/hooks/useRealTimeTokens';

// Column loading skeleton with progressive loading animation
function ColumnLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-lg border border-[#30363d]/50">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363d]/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#21262d] shimmer" />
          <div className="h-4 w-24 bg-[#21262d] rounded shimmer" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-6 w-6 bg-[#21262d] rounded shimmer" />
          <div className="h-6 w-6 bg-[#21262d] rounded shimmer" />
          <div className="h-6 w-6 bg-[#21262d] rounded shimmer" />
        </div>
      </div>
      <div className="flex-1 p-2">
        <TokenColumnSkeleton count={5} variant="shimmer" />
      </div>
    </div>
  );
}

// Real-time status indicator
function RealTimeIndicator({ 
  isRefreshing, 
  lastUpdate, 
  isPaused 
}: { 
  isRefreshing: boolean; 
  lastUpdate: number | null;
  isPaused: boolean;
}) {
  const getTimeAgo = () => {
    if (!lastUpdate) return 'Never';
    const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div className="flex items-center gap-2 text-[10px] text-[#8b949e]">
      <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : isRefreshing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
      <span>{isPaused ? 'Paused' : isRefreshing ? 'Updating...' : `Updated ${getTimeAgo()}`}</span>
    </div>
  );
}

export default function PulsePage() {
  const [activeTab, setActiveTab] = useState<'new-pairs' | 'final-stretch' | 'migrated'>('new-pairs');

  // Real-time data hooks for each column
  const newPairsData = useRealTimeTokens({
    column: 'new-pairs',
    refreshInterval: 3000,
    enabled: true,
  });

  const finalStretchData = useRealTimeTokens({
    column: 'final-stretch',
    refreshInterval: 4000,
    enabled: true,
  });

  const migratedData = useRealTimeTokens({
    column: 'migrated',
    refreshInterval: 5000,
    enabled: true,
  });

  // Get active data based on tab (for mobile)
  const getActiveData = () => {
    switch (activeTab) {
      case 'new-pairs':
        return newPairsData;
      case 'final-stretch':
        return finalStretchData;
      case 'migrated':
        return migratedData;
    }
  };

  const activeData = getActiveData();

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
        <SubHeader />
      </div>

      {/* Mobile Header */}
      <MobileHeader />
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      {/* Mobile: Single column based on active tab */}
      <main className="flex-1 overflow-hidden md:hidden pb-16">
        <div className="h-full p-2">
          {/* Real-time indicator for mobile */}
          <div className="flex justify-end mb-2">
            <RealTimeIndicator 
              isRefreshing={activeData.isRefreshing} 
              lastUpdate={activeData.lastUpdate}
              isPaused={activeData.isPaused}
            />
          </div>
          
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="h-[calc(100%-24px)]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeData.isLoading ? (
                  <ColumnLoadingSkeleton />
                ) : (
                  <TokenColumn
                    id={activeTab}
                    title={
                      activeTab === 'new-pairs' 
                        ? 'New Pairs' 
                        : activeTab === 'final-stretch' 
                        ? 'Final Stretch' 
                        : 'Migrated'
                    }
                    tokens={activeData.tokens}
                    isLoading={activeData.isLoading}
                    error={activeData.error || undefined}
                    onRefresh={activeData.refresh}
                    priceChanges={activeData.priceChanges}
                    isRealTime={true}
                    isPaused={activeData.isPaused}
                    onPause={activeData.pause}
                    onResume={activeData.resume}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </main>

      {/* Desktop: Three Columns */}
      <main className="hidden md:flex flex-1 p-4 pb-12 overflow-hidden">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* New Pairs Column */}
          <ErrorBoundary>
            <motion.div
              className="h-full min-h-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {newPairsData.isLoading ? (
                <ColumnLoadingSkeleton />
              ) : (
                <TokenColumn
                  id="new-pairs"
                  title="New Pairs"
                  tokens={newPairsData.tokens}
                  isLoading={newPairsData.isLoading}
                  error={newPairsData.error || undefined}
                  onRefresh={newPairsData.refresh}
                  priceChanges={newPairsData.priceChanges}
                  isRealTime={true}
                  isPaused={newPairsData.isPaused}
                  onPause={newPairsData.pause}
                  onResume={newPairsData.resume}
                  lastUpdate={newPairsData.lastUpdate}
                  isRefreshing={newPairsData.isRefreshing}
                />
              )}
            </motion.div>
          </ErrorBoundary>

          {/* Final Stretch Column */}
          <ErrorBoundary>
            <motion.div
              className="h-full min-h-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {finalStretchData.isLoading ? (
                <ColumnLoadingSkeleton />
              ) : (
                <TokenColumn
                  id="final-stretch"
                  title="Final Stretch"
                  tokens={finalStretchData.tokens}
                  isLoading={finalStretchData.isLoading}
                  error={finalStretchData.error || undefined}
                  onRefresh={finalStretchData.refresh}
                  priceChanges={finalStretchData.priceChanges}
                  isRealTime={true}
                  isPaused={finalStretchData.isPaused}
                  onPause={finalStretchData.pause}
                  onResume={finalStretchData.resume}
                  lastUpdate={finalStretchData.lastUpdate}
                  isRefreshing={finalStretchData.isRefreshing}
                />
              )}
            </motion.div>
          </ErrorBoundary>

          {/* Migrated Column */}
          <ErrorBoundary>
            <motion.div
              className="h-full min-h-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {migratedData.isLoading ? (
                <ColumnLoadingSkeleton />
              ) : (
                <TokenColumn
                  id="migrated"
                  title="Migrated"
                  tokens={migratedData.tokens}
                  isLoading={migratedData.isLoading}
                  error={migratedData.error || undefined}
                  onRefresh={migratedData.refresh}
                  priceChanges={migratedData.priceChanges}
                  isRealTime={true}
                  isPaused={migratedData.isPaused}
                  onPause={migratedData.pause}
                  onResume={migratedData.resume}
                  lastUpdate={migratedData.lastUpdate}
                  isRefreshing={migratedData.isRefreshing}
                />
              )}
            </motion.div>
          </ErrorBoundary>
        </motion.div>
      </main>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav activeItem="pulse" />
    </div>
  );
}
