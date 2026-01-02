export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  address?: string;
  age: string;
  marketCap: number;
  volume: number;
  price: number;
  txCount: number;
  priceChange: number;
  holders: number;
  liquidity: number;
  devSold: number;
  insiderPercent: number;
  bundlePercent: number;
  sniperPercent: number;
  top10Percent: number;
  creatorAddress: string;
  creatorName: string;
  verified: boolean;
  hasAudit: boolean;
  hasTelegram: boolean;
  hasTwitter: boolean;
  hasWebsite: boolean;
  isNew?: boolean;
  progressPercent?: number;
  socialLinks?: {
    telegram?: string;
    twitter?: string;
    website?: string;
  };
}

export type ColumnType = 'new-pairs' | 'final-stretch' | 'migrated';

export type SortField = 'age' | 'marketCap' | 'volume' | 'txCount' | 'priceChange';

export type SortDirection = 'asc' | 'desc';

export interface ColumnConfig {
  id: ColumnType;
  title: string;
  icon?: string;
  tokens: TokenData[];
}

export interface FilterOptions {
  minMarketCap?: number;
  maxMarketCap?: number;
  minVolume?: number;
  minTx?: number;
  verified?: boolean;
  hasAudit?: boolean;
}

