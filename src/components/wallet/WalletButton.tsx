'use client';
// components/wallet/WalletButton.tsx
// feat(wallet): integrate wallet connection

import { Wallet, LogOut, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { Button, Spinner } from '@/components/ui';
import { WalletState } from '@/types';
import { shortAddress } from '@/lib/mock-data';

interface WalletButtonProps {
  wallet:     WalletState;
  onConnect:  () => void;
  onDisconnect: () => void;
}

export function WalletButton({ wallet, onConnect, onDisconnect }: WalletButtonProps) {
  const [open, setOpen] = useState(false);

  if (wallet.connecting) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 border border-cyan/30 bg-cyan/5 text-cyan text-xs font-mono">
        <Spinner size="sm" />
        <span>CONNECTING…</span>
      </div>
    );
  }

  if (!wallet.connected) {
    return wallet.error ? (
      <div className="max-w-[18rem] rounded-xl border border-rose/20 bg-rose/5 p-3 text-xs font-mono text-rose">
        <div className="flex items-start gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <div>
            <p className="font-semibold">Wallet connection failed</p>
            <p className="text-rose/80 mt-1">{wallet.error}</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={onConnect} className="w-full gap-2">
          <Wallet className="w-3.5 h-3.5" />
          RETRY CONNECT
        </Button>
      </div>
    ) : (
      <Button variant="primary" size="sm" onClick={onConnect} className="gap-2">
        <Wallet className="w-3.5 h-3.5" />
        CONNECT WALLET
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          'flex items-center gap-2.5 px-3 py-2 border text-xs font-mono tracking-wider transition-all duration-150',
          'border-teal/40 bg-teal/5 text-teal hover:border-teal/70 hover:bg-teal/10',
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
        <span>{shortAddress(wallet.address!)}</span>
        <ChevronDown className={clsx('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-panel border border-border shadow-xl z-50 animate-fade-in">
          <div className="p-4 border-b border-border">
            <p className="text-xs text-dim font-mono tracking-widest mb-1">CONNECTED</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0" />
              <p className="text-xs font-mono text-text break-all">{wallet.address}</p>
            </div>
          </div>
          <div className="p-3">
            <button
              onClick={() => { onDisconnect(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-rose hover:bg-rose/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              DISCONNECT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
