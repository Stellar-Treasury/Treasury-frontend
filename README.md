# DAO Treasury Dashboard — Frontend

> A production-ready Next.js dashboard for interacting with the Stellar Soroban DAO multisig treasury contract. Connect a Freighter wallet, view treasury balances, create proposals, approve pending proposals, and track signer approvals.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
- [Environment Variables](#environment-variables)
- [Connecting to the Contract](#connecting-to-the-contract)
- [Component Architecture](#component-architecture)
- [Conventional Commits](#conventional-commits)
- [Roadmap](#roadmap)

---

## Overview

The dashboard provides a real-time interface for DAO members to manage treasury operations without touching the CLI. It mirrors the state of the on-chain `dao-multisig` Soroban contract and lets authorised signers:

- **View** the treasury balance (XLM + USDC) and current signer set
- **Create** Transfer, AddSigner, or RemoveSigner proposals via a validated form
- **Approve** pending proposals with a single click
- **Cancel** proposals that should not proceed
- **Track** the approval progress bar toward the configured threshold

---

## Features

| Feature | Status |
|---------|--------|
| Freighter wallet connection | ✅ Wired (mock in dev) |
| Treasury balance display | ✅ |
| Signer list + config panel | ✅ |
| Create Transfer proposal | ✅ with validation |
| Create AddSigner proposal | ✅ with validation |
| Create RemoveSigner proposal | ✅ with validation |
| Approve proposal | ✅ |
| Cancel proposal | ✅ |
| Filter proposals by status | ✅ |
| Proposal drawer with escape and backdrop close | ✅ |
| Wallet connection error state | ✅ |
| Approval progress bar | ✅ |
| Responsive layout | ✅ |
| Loading + submitting states | ✅ |
| Read-only mode for non-signers | ✅ |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Fonts | Space Mono · JetBrains Mono · DM Sans (Google Fonts) |
| Wallet | Freighter API (stubbed for development) |
| Contract client | `soroban-client` / `@stellar/stellar-sdk` (integration-ready) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, body wrapper
│   ├── page.tsx            # Dashboard page — full composition
│   └── globals.css         # Tailwind directives + custom utilities
│
├── components/
│   ├── ui/
│   │   └── index.tsx       # Primitives: Button, Card, Input, Badge, Spinner, etc.
│   ├── wallet/
│   │   └── WalletButton.tsx  # Connect / disconnect / address dropdown
│   ├── treasury/
│   │   └── TreasuryPanel.tsx # Balance cards, config, signer list
│   └── proposals/
│       ├── ProposalCard.tsx       # Single proposal — details, progress, actions
│       ├── ProposalList.tsx       # Filtered list with status tabs
│       └── CreateProposalForm.tsx # Slide-over form with validation
│
├── hooks/
│   ├── useWallet.ts      # Wallet connection state + helpers
│   └── useProposals.ts   # Proposal CRUD — mock → replace with RPC calls
│
├── lib/
│   └── mock-data.ts      # Sample data, formatters, address shortener
│
└── types/
    └── index.ts          # Shared TypeScript types matching Soroban contract
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| npm / pnpm / yarn | latest |

### Installation

```bash
# Clone the repo
git clone git@github.com:Stellar-Treasury/multisig-contracts.git
cd multisig-contracts/frontend

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs against **mock data** by default — no wallet or contract connection is required for development.

### Building for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Deployed Soroban contract ID
NEXT_PUBLIC_CONTRACT_ID=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA

# Stellar network: testnet | mainnet | futurenet
NEXT_PUBLIC_NETWORK=testnet

# Soroban RPC endpoint
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org

# Horizon API
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

---

## Connecting to the Contract

The hooks in `src/hooks/` are designed to be swapped from mock to real with minimal changes.

### 1. Install the Stellar SDK

```bash
npm install @stellar/stellar-sdk
```

### 2. Replace `useWallet.ts` connect body

```ts
import freighter from '@stellar/freighter-api';

const connect = async () => {
  const isAllowed = await freighter.isAllowed();
  if (!isAllowed) await freighter.setAllowed();
  const { publicKey } = await freighter.getAddress();
  setWallet({ connected: true, address: publicKey, ... });
};
```

### 3. Replace `useProposals.ts` with RPC calls

```ts
import { Contract, SorobanRpc } from '@stellar/stellar-sdk';

const server = new SorobanRpc.Server(process.env.NEXT_PUBLIC_RPC_URL!);

// Example: fetch proposals
const proposals = await server.getContractData(
  process.env.NEXT_PUBLIC_CONTRACT_ID!,
  ...
);
```

---

## Component Architecture

```
page.tsx
├── <WalletButton />            wallet/WalletButton.tsx
├── <TreasuryPanel />           treasury/TreasuryPanel.tsx
│   └── <StatCard />            ui/index.tsx
├── <ProposalList />            proposals/ProposalList.tsx
│   └── <ProposalCard />        proposals/ProposalCard.tsx
│       └── <StatusBadge />     ui/index.tsx
│       └── <Button />          ui/index.tsx
└── <CreateProposalForm />      proposals/CreateProposalForm.tsx  (slide-over)
    └── <Input />, <Select />, <Textarea />, <Button />
```

All primitives live in `src/components/ui/index.tsx` and are framework-agnostic — easy to extract or replace.

---

## Conventional Commits

```
feat(ui): add dashboard layout
feat(ui): implement proposal creation form
feat(ui): add proposal card with approval progress
feat(ui): add filtered proposal list with status tabs
feat(wallet): integrate wallet connection
feat(treasury): add treasury balance and signer panel
fix(ui): handle loading states properly
refactor(ui): extract reusable UI primitives
chore(ui): configure Next.js, Tailwind, TypeScript
docs(ui): add frontend README with setup and integration guide
```

---

## Roadmap

- [ ] Live Soroban RPC integration (replace mock hooks)
- [ ] Real-time proposal updates via Stellar event streaming
- [ ] Transaction signing and submission via Freighter
- [ ] Toast notifications for tx confirmation / error
- [ ] Proposal detail page (`/proposals/[id]`)
- [ ] Dark/light theme toggle
- [ ] Mobile wallet deep-link support
