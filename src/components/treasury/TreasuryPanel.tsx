'use client';
// components/treasury/TreasuryPanel.tsx

import { TrendingUp, Layers, RefreshCw } from 'lucide-react';
import { TreasuryBalance, Signer, DaoConfig } from '@/types';
import { Card, StatCard, Divider } from '@/components/ui';
import { formatXLM, formatUSD, shortAddress } from '@/lib/mock-data';

interface TreasuryPanelProps {
  balance:  TreasuryBalance;
  signers:  Signer[];
  config:   DaoConfig;
  loading?: boolean;
  onRefresh?: () => void;
}

export function TreasuryPanel({ balance, signers, config, loading, onRefresh }: TreasuryPanelProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan" />
          <span className="text-xs font-mono tracking-widest text-dim uppercase">Treasury</span>
        </div>
        <button
          onClick={onRefresh}
          className="text-dim hover:text-cyan transition-colors p-1"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 gap-3">
        <StatCard
          label="Total Value (USD)"
          value={formatUSD(balance.total)}
          accent="cyan"
        />
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="XLM Balance" value={formatXLM(balance.xlm)} sub="XLM" accent="teal" />
          <StatCard label="USDC Balance" value={formatXLM(balance.usdc)} sub="USDC" accent="amber" />
        </div>
      </div>

      {/* DAO Config */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-cyan" />
          <span className="text-xs font-mono tracking-widest text-dim uppercase">Config</span>
        </div>
        <div className="space-y-2">
          <ConfigRow label="Threshold"  value={`${config.threshold} of ${config.signerCount}`} />
          <ConfigRow label="Network"    value={config.network.toUpperCase()} accent />
          <ConfigRow label="Contract"   value={shortAddress(config.contractId)} mono />
        </div>
      </Card>

      {/* Signers */}
      <Card className="p-4">
        <p className="text-xs font-mono tracking-widest text-dim uppercase mb-3">
          Signers ({signers.length})
        </p>
        <div className="space-y-2">
          {signers.map((s, i) => (
            <div key={s.address} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center bg-cyan/10 text-cyan text-xs font-mono border border-cyan/20">
                  {i + 1}
                </div>
                <div>
                  {s.label && <p className="text-xs font-mono text-text">{s.label}</p>}
                  <p className="text-xs font-mono text-dim">{shortAddress(s.address)}</p>
                </div>
              </div>
              <span className="text-xs text-subtle font-mono">#{s.joinedAt}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ConfigRow({ label, value, accent, mono }: {
  label: string; value: string; accent?: boolean; mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs font-mono text-dim">{label}</span>
      <span className={`text-xs font-mono ${accent ? 'text-teal' : mono ? 'text-subtle' : 'text-text'}`}>{value}</span>
    </div>
  );
}
