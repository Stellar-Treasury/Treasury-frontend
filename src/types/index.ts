// types/index.ts
// Core domain types mirroring the on-chain Soroban contract data model

export type ProposalStatus = 'Pending' | 'Executed' | 'Cancelled';

export type ProposalKind =
  | { type: 'Transfer';      recipient: string; amount: number }
  | { type: 'AddSigner';     signer: string }
  | { type: 'RemoveSigner';  signer: string };

export interface Proposal {
  id:          number;
  proposer:    string;
  kind:        ProposalKind;
  description: string;
  approvals:   string[];
  status:      ProposalStatus;
  createdAt:   number;        // ledger sequence
  threshold:   number;        // snapshot of threshold at creation time
}

export interface TreasuryBalance {
  xlm:   number;           // in XLM (not stroops)
  usdc:  number;
  total: number;           // USD equivalent
}

export interface Signer {
  address:   string;
  label?:    string;
  joinedAt?: number;
}

export interface WalletState {
  connected:  boolean;
  address:    string | null;
  publicKey:  string | null;
  connecting: boolean;
  error:      string | null;
}

export interface DaoConfig {
  contractId:  string;
  network:     'testnet' | 'mainnet' | 'futurenet';
  threshold:   number;
  signerCount: number;
}
