'use client';
// hooks/useProposals.ts
// Manages proposal state — fetching, creating, approving, cancelling.
// All mutations simulate network delay; replace bodies with soroban-client calls.

import { useState, useCallback } from 'react';
import { Proposal, ProposalKind } from '@/types';
import { MOCK_PROPOSALS, MOCK_CONFIG } from '@/lib/mock-data';

export function useProposals() {
  const [proposals, setProposals]   = useState<Proposal[]>(MOCK_PROPOSALS);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    await new Promise(res => setTimeout(res, 800));
    setProposals([...MOCK_PROPOSALS]);
    setLoading(false);
  }, []);

  const createProposal = useCallback(async (
    proposer: string,
    kind: ProposalKind,
    description: string,
  ): Promise<number> => {
    setSubmitting(true);
    setError(null);
    await new Promise(res => setTimeout(res, 1500));

    const newId = Math.max(...proposals.map(p => p.id)) + 1;
    const newProposal: Proposal = {
      id:          newId,
      proposer,
      kind,
      description,
      approvals:   [],
      status:      'Pending',
      createdAt:   1120,
      threshold:   MOCK_CONFIG.threshold,
    };
    setProposals(prev => [newProposal, ...prev]);
    setSubmitting(false);
    return newId;
  }, [proposals]);

  const approveProposal = useCallback(async (
    proposalId: number,
    signer: string,
  ) => {
    setSubmitting(true);
    setError(null);
    await new Promise(res => setTimeout(res, 1200));

    setProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      if (p.approvals.includes(signer)) return p;
      const newApprovals = [...p.approvals, signer];
      const newStatus = newApprovals.length >= p.threshold ? 'Executed' : 'Pending';
      return { ...p, approvals: newApprovals, status: newStatus };
    }));
    setSubmitting(false);
  }, []);

  const cancelProposal = useCallback(async (proposalId: number) => {
    setSubmitting(true);
    await new Promise(res => setTimeout(res, 900));
    setProposals(prev => prev.map(p =>
      p.id === proposalId ? { ...p, status: 'Cancelled' } : p
    ));
    setSubmitting(false);
  }, []);

  return {
    proposals,
    loading,
    submitting,
    error,
    refetch,
    createProposal,
    approveProposal,
    cancelProposal,
  };
}
