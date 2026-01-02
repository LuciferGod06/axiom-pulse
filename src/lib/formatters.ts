/**
 * Format a number as currency (USD)
 */
export function formatCurrency(num: number, decimals: number = 2): string {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num.toFixed(decimals)}`;
}

/**
 * Format a number with abbreviation (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format a price with appropriate decimal places
 */
export function formatPrice(num: number): string {
  if (num < 0.0001) return num.toFixed(8);
  if (num < 0.001) return num.toFixed(6);
  if (num < 0.01) return num.toFixed(5);
  if (num < 1) return num.toFixed(4);
  if (num < 100) return num.toFixed(2);
  return num.toFixed(0);
}

/**
 * Format a percentage with optional sign
 */
export function formatPercent(num: number, showSign: boolean = true): string {
  const sign = showSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}

/**
 * Format an address for display (truncated)
 */
export function formatAddress(address: string, startChars: number = 4, endChars: number = 4): string {
  if (address.length <= startChars + endChars + 3) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format a timestamp as relative time
 */
export function formatRelativeTime(timestamp: number | Date): string {
  const now = Date.now();
  const time = timestamp instanceof Date ? timestamp.getTime() : timestamp;
  const diff = now - time;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

/**
 * Parse an age string to seconds
 */
export function parseAge(age: string): number {
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
}

/**
 * Get color class based on percentage value
 */
export function getPercentColor(value: number, inverse: boolean = false): string {
  if (inverse) {
    if (value <= 10) return 'text-green-400';
    if (value <= 30) return 'text-yellow-400';
    return 'text-red-400';
  }
  if (value >= 70) return 'text-green-400';
  if (value >= 30) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Get color class based on price change
 */
export function getPriceChangeColor(change: number): string {
  if (change > 0) return 'text-green-400';
  if (change < 0) return 'text-red-400';
  return 'text-[#8b949e]';
}

