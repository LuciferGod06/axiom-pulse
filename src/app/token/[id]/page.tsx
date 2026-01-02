'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header, Footer } from '@/components/layout';
import { TokenDetailHeader } from '@/components/tokens/TokenDetailHeader';
import { TokenChart } from '@/components/chart/TokenChart';
import { TradingPanel } from '@/components/trading/TradingPanel';
import { TokenDetailTabs } from '@/components/tokens/TokenDetailTabs';
import { TokenData } from '@/types/token';
import { mockNewPairs, mockFinalStretch, mockMigrated } from '@/lib/mock-data';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Combine all mock tokens
const allTokens = [...mockNewPairs, ...mockFinalStretch, ...mockMigrated];

export default function TokenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    setTimeout(() => {
      // Find token by id
      const foundToken = allTokens.find(t => t.id === params.id);
      
      if (foundToken) {
        setToken(foundToken);
      } else {
        // Use first token as fallback for demo
        setToken(allTokens[0]);
      }
      
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#58a6ff] animate-spin" />
          <span className="text-[#8b949e]">Loading token data...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[#e6edf3] text-xl">Token not found</span>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pulse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {/* Header */}
      <Header />

      {/* Token Header */}
      <TokenDetailHeader token={token} />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Chart & Tabs */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-4"
          >
            <TokenChart symbol={token.symbol} basePrice={token.price} className="h-full min-h-[450px]" />
          </motion.div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 pt-0"
          >
            <TokenDetailTabs
              symbol={token.symbol}
              holdersCount={token.holders}
              className="h-[280px]"
            />
          </motion.div>
        </div>

        {/* Right Side - Trading Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-80 flex-shrink-0 p-4 pl-0"
        >
          <TradingPanel
            symbol={token.symbol}
            price={token.price}
            isMigrating={token.progressPercent !== undefined && token.progressPercent < 100}
            className="h-full"
          />
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

