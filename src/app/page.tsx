'use client';
// src/app/page.tsx
// feat(ui): add dashboard layout
//
// Main entry point for the DAO treasury dashboard.
// Composes: TopBar, TreasuryPanel, ProposalList, CreateProposalForm (slide-over).

import { useState } from 'react';
import { clsx } from 'clsx';
import {
  Activity, PlusCircle, ExternalLink, AlertCircle, Github,
} from 'lucide-react';

import { useWallet }    from '@/hooks/useWallet';
import { useProposals } from '@/hooks/useProposals';

import { WalletButton }        from '@/components/wallet/WalletButton';
import { TreasuryPanel }       from '@/components/treasury/TreasuryPanel';
import { ProposalList }        from '@/components/proposals/ProposalList';
import { CreateProposalForm }  from '@/components/proposals/CreateProposalForm';
import { Button }              from '@/components/ui';

import {
  MOCK_BALANCE, MOCK_SIGNERS, MOCK_CONFIG,
} from '@/lib/mock-data';

export default function DashboardPage() {
  const { wallet, connect, disconnect, isSigner } = useWallet();
  const {
    proposals, loading, submitting,
    refetch, createProposal, approveProposal, cancelProposal,
  } = useProposals();

  const [showForm, setShowForm] = useState(false);

  const signerAddresses = MOCK_SIGNERS.map(s => s.address);
  const userIsSigner    = isSigner(signerAddresses);

  const pendingCount = proposals.filter(p => p.status === 'Pending').length;

  async function handleCreate(kind: Parameters<typeof createProposal>[1], description: string) {
    if (!wallet.address) return;
    await createProposal(wallet.address, kind, description);
  }

  return (
    <div className="min-h-screen bg-void grid-bg flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-void/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 border border-cyan/40 flex items-center justify-center relative">
              <span className="text-cyan text-xs font-mono font-bold">⬡</span>
              <span className="absolute inset-0 border border-cyan/20 scale-110 opacity-50" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-mono font-bold text-bright tracking-widest">STELLAR</span>
              <span className="text-sm font-mono text-dim tracking-widest"> / DAO</span>
            </div>
          </div>

          {/* Center — network + live status */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <span className="text-dim">{MOCK_CONFIG.network.toUpperCase()}</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1.5 text-xs font-mono text-dim">
              <Activity className="w-3 h-3 text-cyan" />
              <span>LEDGER #1120</span>
            </div>
            {pendingCount > 0 && (
              <>
                <div className="w-px h-3 bg-border" />
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber">
                  <AlertCircle className="w-3 h-3" />
                  <span>{pendingCount} PENDING</span>
                </div>
              </>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {wallet.connected && userIsSigner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
                className="hidden sm:flex text-xs gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                NEW PROPOSAL
              </Button>
            )}
            <WalletButton
              wallet={wallet}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6">

        {/* Not connected — hero prompt */}
        {!wallet.connected && (
          <div className="mb-8 p-6 border border-cyan/20 bg-cyan/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
            <div>
              <p className="text-sm font-mono text-cyan tracking-wider mb-1">CONNECT YOUR WALLET</p>
              <p className="text-xs text-dim">Connect a Freighter wallet to approve proposals and create new ones.</p>
            </div>
            <Button variant="primary" size="sm" onClick={connect} loading={wallet.connecting}>
              CONNECT FREIGHTER
            </Button>
          </div>
        )}

        {/* Connected but not a signer */}
        {wallet.connected && !userIsSigner && (
          <div className="mb-8 p-4 border border-amber/20 bg-amber/5 flex items-start gap-3 animate-fade-in-up">
            <AlertCircle className="w-4 h-4 text-amber mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-mono text-amber tracking-wider mb-0.5">READ-ONLY MODE</p>
              <p className="text-xs text-dim">Your connected address is not an authorised signer. You can view proposals but cannot approve or create them.</p>
            </div>
          </div>
        )}

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left sidebar — treasury */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <TreasuryPanel
              balance={MOCK_BALANCE}
              signers={MOCK_SIGNERS}
              config={MOCK_CONFIG}
              loading={loading}
              onRefresh={refetch}
            />
          </aside>

          {/* Right main — proposals */}
          <div className="flex-1 min-w-0">
            {/* Mobile: new proposal CTA */}
            {wallet.connected && userIsSigner && (
              <div className="sm:hidden mb-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowForm(true)}
                  className="w-full"
                >
                  <PlusCircle className="w-4 h-4" />
                  NEW PROPOSAL
                </Button>
              </div>
            )}

            <ProposalList
              proposals={proposals}
              connectedAddress={wallet.address}
              isSigner={userIsSigner}
              loading={loading}
              submitting={submitting}
              onApprove={id => approveProposal(id, wallet.address!)}
              onCancel={cancelProposal}
            />
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-4">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-mono text-dim">
            CONTRACT:{' '}
            <span className="text-subtle">{MOCK_CONFIG.contractId.slice(0, 16)}…</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Stellar-Treasury/multisig-contracts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-dim hover:text-cyan transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              SOURCE
            </a>
            <a
              href="https://stellar.expert/explorer/testnet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-dim hover:text-cyan transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              EXPLORER
            </a>
          </div>
        </div>
      </footer>

      {/* ── Create proposal slide-over ───────────────────────────────────── */}
      {showForm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-void/70 backdrop-blur-sm z-50"
            onClick={() => setShowForm(false)}
          />
          {/* Panel */}
          <div className={clsx(
            'fixed right-0 top-0 h-full w-full max-w-md bg-panel border-l border-border z-50',
            'flex flex-col animate-slide-in-right',
          )}>
            <CreateProposalForm
              proposerAddress={wallet.address!}
              onSubmit={handleCreate}
              onClose={() => setShowForm(false)}
              submitting={submitting}
            />
          </div>
        </>
      )}
    </div>
  );
}
