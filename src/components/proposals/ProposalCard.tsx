'use client';
// components/proposals/ProposalCard.tsx

import { UserPlus, UserMinus, ArrowUpRight, CheckCheck, X, Clock } from 'lucide-react';
import { Proposal } from '@/types';
import { Card, StatusBadge, Button, Divider } from '@/components/ui';
import { shortAddress, timeSince } from '@/lib/mock-data';
import { clsx } from 'clsx';

interface ProposalCardProps {
  proposal:        Proposal;
  connectedAddress: string | null;
  onApprove:       (id: number) => void;
  onCancel:        (id: number) => void;
  submitting?:     boolean;
  isSigner:        boolean;
}

const KIND_ICONS = {
  Transfer:     <ArrowUpRight className="w-3.5 h-3.5" />,
  AddSigner:    <UserPlus className="w-3.5 h-3.5" />,
  RemoveSigner: <UserMinus className="w-3.5 h-3.5" />,
};

const KIND_LABELS = {
  Transfer:     'TRANSFER',
  AddSigner:    'ADD SIGNER',
  RemoveSigner: 'REMOVE SIGNER',
};

export function ProposalCard({
  proposal, connectedAddress, onApprove, onCancel, submitting, isSigner
}: ProposalCardProps) {
  const hasApproved = connectedAddress
    ? proposal.approvals.includes(connectedAddress)
    : false;

  const progress = Math.min(100, (proposal.approvals.length / proposal.threshold) * 100);
  const canAct   = isSigner && proposal.status === 'Pending' && !hasApproved;

  const kindIcon  = KIND_ICONS[proposal.kind.type];
  const kindLabel = KIND_LABELS[proposal.kind.type];

  return (
    <Card
      className={clsx(
        'p-5 transition-all duration-200 hover:border-border/80',
        proposal.status === 'Pending' && 'border-l-2 border-l-amber/60',
        proposal.status === 'Executed' && 'border-l-2 border-l-lime/60',
        proposal.status === 'Cancelled' && 'border-l-2 border-l-rose/30 opacity-60',
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-dim shrink-0">#{proposal.id}</span>
          <span className={clsx(
            'flex items-center gap-1 text-xs font-mono px-2 py-0.5 shrink-0',
            proposal.kind.type === 'Transfer'     && 'bg-cyan/10 text-cyan',
            proposal.kind.type === 'AddSigner'    && 'bg-teal/10 text-teal',
            proposal.kind.type === 'RemoveSigner' && 'bg-rose/10 text-rose',
          )}>
            {kindIcon}
            {kindLabel}
          </span>
        </div>
        <StatusBadge status={proposal.status} pulse />
      </div>

      {/* Description */}
      <p className="text-sm text-text mb-3 leading-relaxed">{proposal.description}</p>

      {/* Payload details */}
      <div className="bg-surface border border-border/60 p-3 mb-3 font-mono text-xs space-y-1">
        {proposal.kind.type === 'Transfer' && (
          <>
            <Row label="TO"     value={shortAddress(proposal.kind.recipient)} />
            <Row label="AMOUNT" value={`${proposal.kind.amount.toLocaleString()} XLM`} accent="cyan" />
          </>
        )}
        {(proposal.kind.type === 'AddSigner' || proposal.kind.type === 'RemoveSigner') && (
          <Row
            label={proposal.kind.type === 'AddSigner' ? 'ADD' : 'REMOVE'}
            value={shortAddress(proposal.kind.signer)}
            accent={proposal.kind.type === 'AddSigner' ? 'teal' : 'rose'}
          />
        )}
        <Row label="PROPOSER" value={shortAddress(proposal.proposer)} />
      </div>

      {/* Approval progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono text-dim">
            APPROVALS {proposal.approvals.length} / {proposal.threshold}
          </span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-dim" />
            <span className="text-xs font-mono text-dim">{timeSince(proposal.createdAt)}</span>
          </div>
        </div>
        <div className="h-1 bg-muted overflow-hidden">
          <div
            className={clsx(
              'h-full transition-all duration-700',
              proposal.status === 'Executed' ? 'bg-lime' : 'bg-cyan',
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        {proposal.approvals.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {proposal.approvals.map(addr => (
              <span key={addr} className="text-xs font-mono px-1.5 py-0.5 bg-muted text-dim">
                {shortAddress(addr)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {proposal.status === 'Pending' && isSigner && (
        <>
          <Divider className="mb-3" />
          <div className="flex gap-2">
            {!hasApproved ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onApprove(proposal.id)}
                loading={submitting}
                className="flex-1 text-xs"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                APPROVE
              </Button>
            ) : (
              <div className="flex-1 flex items-center gap-1.5 px-3 py-1.5 bg-teal/10 text-teal text-xs font-mono">
                <CheckCheck className="w-3.5 h-3.5" />
                YOU APPROVED
              </div>
            )}
            {!hasApproved && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancel(proposal.id)}
                loading={submitting}
                className="text-xs"
              >
                <X className="w-3.5 h-3.5" />
                CANCEL
              </Button>
            )}
          </div>
        </>
      )}

      {!isSigner && proposal.status === 'Pending' && (
        <p className="text-xs font-mono text-dim border-t border-border pt-3 mt-1">
          Connect a signer wallet to approve
        </p>
      )}
    </Card>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: 'cyan' | 'teal' | 'rose' }) {
  const colors = { cyan: 'text-cyan', teal: 'text-teal', rose: 'text-rose' };
  return (
    <div className="flex gap-3">
      <span className="text-subtle w-20 shrink-0">{label}</span>
      <span className={accent ? colors[accent] : 'text-text'}>{value}</span>
    </div>
  );
}
