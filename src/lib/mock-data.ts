// lib/mock-data.ts
// Realistic mock data for UI development.
// Replace with actual Soroban RPC calls once contract is deployed.

import { Proposal, TreasuryBalance, Signer, DaoConfig } from '@/types';

export const MOCK_CONFIG: DaoConfig = {
  contractId:  'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
  network:     'testnet',
  threshold:   2,
  signerCount: 3,
};

export const MOCK_SIGNERS: Signer[] = [
  { address: 'GABC1234STELLARTEST0000001AAAAAAAAAAAAAAAAAAAAAAAAAAAA', label: 'Core Team A', joinedAt: 1000 },
  { address: 'GDEF5678STELLARTEST0000002BBBBBBBBBBBBBBBBBBBBBBBBBBBB', label: 'Core Team B', joinedAt: 1002 },
  { address: 'GHIJ9012STELLARTEST0000003CCCCCCCCCCCCCCCCCCCCCCCCCCCC', label: 'Treasurer',   joinedAt: 1005 },
];

export const MOCK_BALANCE: TreasuryBalance = {
  xlm:   142_500.75,
  usdc:  28_340.00,
  total: 56_825.30,
};

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id:          1,
    proposer:    'GABC1234STELLARTEST0000001AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    kind:        { type: 'Transfer', recipient: 'GXYZ0001DEVGRANTRECIPIENT000000AAAAAAAAAAAAAAAAAAAAAAAA', amount: 5000 },
    description: 'Q3 developer grant payment to @alice for Soroban SDK contributions.',
    approvals:   ['GABC1234STELLARTEST0000001AAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'GDEF5678STELLARTEST0000002BBBBBBBBBBBBBBBBBBBBBBBBBBBB'],
    status:      'Executed',
    createdAt:   1080,
    threshold:   2,
  },
  {
    id:          2,
    proposer:    'GDEF5678STELLARTEST0000002BBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    kind:        { type: 'Transfer', recipient: 'GXYZ0002AUDITFIRMRECIPIENT00000BBBBBBBBBBBBBBBBBBBBBBB', amount: 12000 },
    description: 'Security audit payment — Trail of Bits invoice #TB-2024-0042.',
    approvals:   ['GDEF5678STELLARTEST0000002BBBBBBBBBBBBBBBBBBBBBBBBBBBB'],
    status:      'Pending',
    createdAt:   1102,
    threshold:   2,
  },
  {
    id:          3,
    proposer:    'GHIJ9012STELLARTEST0000003CCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    kind:        { type: 'AddSigner', signer: 'GNEW0001NEWSIGNERCANDIDATE00000DDDDDDDDDDDDDDDDDDDDDDDD' },
    description: 'Onboard @dave as fourth DAO council member. Community vote passed 94%.',
    approvals:   [],
    status:      'Pending',
    createdAt:   1115,
    threshold:   2,
  },
  {
    id:          4,
    proposer:    'GABC1234STELLARTEST0000001AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    kind:        { type: 'Transfer', recipient: 'GXYZ0003MARKETINGBUDGET00000000EEEEEEEEEEEEEEEEEEEEEEE', amount: 3500 },
    description: 'Community marketing sprint — Stellar ecosystem event sponsorship.',
    approvals:   ['GABC1234STELLARTEST0000001AAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
    status:      'Cancelled',
    createdAt:   1095,
    threshold:   2,
  },
  {
    id:          5,
    proposer:    'GDEF5678STELLARTEST0000002BBBBBBBBBBBBBBBBBBBBBBBBBBBB',
    kind:        { type: 'RemoveSigner', signer: 'GOLD0001DEPARTEDSIGNERADDR00000FFFFFFFFFFFFFFFFFFFFFFFFFFF' },
    description: 'Remove inactive signer — no participation in last 6 months.',
    approvals:   ['GDEF5678STELLARTEST0000002BBBBBBBBBBBBBBBBBBBBBBBBBBBB', 'GHIJ9012STELLARTEST0000003CCCCCCCCCCCCCCCCCCCCCCCCCCCC'],
    status:      'Executed',
    createdAt:   1088,
    threshold:   2,
  },
];

// Utility helpers
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
  // Mock: treat ledger difference as approximate minutes
  const delta = 1120 - ledgerSeq;
  if (delta < 60)  return `${delta}m ago`;
  if (delta < 1440) return `${Math.floor(delta / 60)}h ago`;
  return `${Math.floor(delta / 1440)}d ago`;
}
