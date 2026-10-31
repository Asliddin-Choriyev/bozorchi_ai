// Format numbers with spaces: 12800 -> "12 800 UZS"
export function formatUZS(amount: number, showSuffix = true): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return showSuffix ? `${formatted} UZS` : formatted;
}

// Format percent change with indicator
export function formatChange(percent: number): {
  text: string;
  isIncrease: boolean; // price went UP (red/expensive)
  isDrop: boolean;     // price went DOWN (green/cheaper)
  symbol: string;
} {
  const abs = Math.abs(percent).toFixed(1);
  if (percent > 0) {
    return {
      text: `▲ +${abs}%`,
      isIncrease: true,
      isDrop: false,
      symbol: '▲'
    };
  } else if (percent < 0) {
    return {
      text: `▼ -${abs}%`,
      isIncrease: false,
      isDrop: true,
      symbol: '▼'
    };
  }
  return {
    text: `• 0.0%`,
    isIncrease: false,
    isDrop: false,
    symbol: '•'
  };
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + ' mln';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + ' ming';
  }
  return num.toString();
}
