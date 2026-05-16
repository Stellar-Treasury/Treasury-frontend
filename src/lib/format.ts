export function shortAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatXLM(amount: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function timeSince(ledgerSeq: number): string {
  const delta = 1120 - ledgerSeq;
  if (delta < 60) return `${delta}m ago`;
  if (delta < 1440) return `${Math.floor(delta / 60)}h ago`;
  return `${Math.floor(delta / 1440)}d ago`;
}
