'use client';
// components/proposals/ProposalList.tsx

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { Proposal, ProposalStatus } from '@/types';
import { ProposalCard } from './ProposalCard';
import { EmptyState, Spinner } from '@/components/ui';

type Filter = 'All' | ProposalStatus;
const FILTERS: Filter[] = ['All', 'Pending', 'Executed', 'Cancelled'];

interface ProposalListProps {
  proposals:        Proposal[];
  connectedAddress: string | null;
  isSigner:         boolean;
  loading:          boolean;
  submitting:       boolean;
  onApprove:        (id: number) => void;
  onCancel:         (id: number) => void;
}

export function ProposalList({
  proposals, connectedAddress, isSigner, loading, submitting, onApprove, onCancel
}: ProposalListProps) {
  const [filter, setFilter] = useState<Filter>('All');

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? proposals.length : proposals.filter(p => p.status === f).length;
    return acc;
  }, {} as Record<Filter, number>);

  const visible = filter === 'All'
    ? proposals
    : proposals.filter(p => p.status === filter);

  return (
    <div className="flex flex-col gap-4">
      {/* Header + filter tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan" />
          <span className="text-xs font-mono tracking-widest text-dim uppercase">Proposals</span>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center border border-border">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1.5 text-xs font-mono tracking-wider transition-all border-r border-border last:border-r-0',
                filter === f
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-dim hover:text-text hover:bg-muted',
              )}
            >
              {f}
              <span className={clsx(
                'ml-1.5 text-xs',
                filter === f ? 'text-cyan' : 'text-subtle',
              )}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* fix(ui): handle loading states properly */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2">
          <Spinner />
          <span className="text-xs font-mono text-dim">FETCHING PROPOSALS…</span>
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title="NO PROPOSALS FOUND"
          description={filter === 'All' ? 'Create the first proposal to get started.' : `No ${filter.toLowerCase()} proposals.`}
        />
      ) : (
        <div className="space-y-3">
          {visible.map(p => (
            <ProposalCard
              key={p.id}
              proposal={p}
              connectedAddress={connectedAddress}
              isSigner={isSigner}
              onApprove={onApprove}
              onCancel={onCancel}
              submitting={submitting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
