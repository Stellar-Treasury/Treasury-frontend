import { ProposalKind } from '@/types';

export function getProposalKindLabel(kind: ProposalKind): string {
  switch (kind.type) {
    case 'Transfer': return 'Transfer Funds';
    case 'AddSigner': return 'Add Signer';
    case 'RemoveSigner': return 'Remove Signer';
    default: return 'Proposal';
  }
}

export function getProposalPayloadLabel(kind: ProposalKind): string {
  switch (kind.type) {
    case 'Transfer': return 'Recipient';
    case 'AddSigner': return 'Signer';
    case 'RemoveSigner': return 'Signer';
    default: return 'Details';
  }
}

export function getProposalTypeAccent(kind: ProposalKind): 'cyan' | 'teal' | 'rose' {
  return kind.type === 'Transfer' ? 'cyan' : kind.type === 'AddSigner' ? 'teal' : 'rose';
}
