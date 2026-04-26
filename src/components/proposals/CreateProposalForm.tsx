'use client';
// components/proposals/CreateProposalForm.tsx
// feat(ui): implement proposal creation form

import { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { ProposalKind } from '@/types';
import { Button, Input, Textarea, Select, FieldLabel, Divider } from '@/components/ui';

type FormKind = 'Transfer' | 'AddSigner' | 'RemoveSigner';

interface FormState {
  kind:        FormKind;
  description: string;
  recipient:   string;
  amount:      string;
  signerAddr:  string;
}

interface Errors {
  description?: string;
  recipient?:   string;
  amount?:      string;
  signerAddr?:  string;
}

interface CreateProposalFormProps {
  proposerAddress: string;
  onSubmit:        (kind: ProposalKind, description: string) => Promise<void>;
  onClose:         () => void;
  submitting?:     boolean;
}

export function CreateProposalForm({
  proposerAddress, onSubmit, onClose, submitting
}: CreateProposalFormProps) {
  const [form, setForm] = useState<FormState>({
    kind:        'Transfer',
    description: '',
    recipient:   '',
    amount:      '',
    signerAddr:  '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.kind === 'Transfer') {
      if (!form.recipient.trim()) e.recipient = 'Recipient address required';
      else if (form.recipient.length < 56) e.recipient = 'Invalid Stellar address';
      const amt = parseFloat(form.amount);
      if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Enter a valid positive amount';
    }
    if (form.kind === 'AddSigner' || form.kind === 'RemoveSigner') {
      if (!form.signerAddr.trim()) e.signerAddr = 'Signer address required';
      else if (form.signerAddr.length < 56) e.signerAddr = 'Invalid Stellar address';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    let kind: ProposalKind;
    if (form.kind === 'Transfer') {
      kind = { type: 'Transfer', recipient: form.recipient.trim(), amount: parseFloat(form.amount) };
    } else if (form.kind === 'AddSigner') {
      kind = { type: 'AddSigner', signer: form.signerAddr.trim() };
    } else {
      kind = { type: 'RemoveSigner', signer: form.signerAddr.trim() };
    }

    await onSubmit(kind, form.description.trim());
    setSuccess(true);
    setTimeout(onClose, 1500);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-teal/10 border border-teal/30 text-teal text-xl">✓</div>
        <p className="text-sm font-mono text-teal tracking-wider">PROPOSAL CREATED</p>
        <p className="text-xs text-dim font-mono">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Form header */}
      <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-cyan" />
          <span className="text-sm font-mono tracking-widest text-text">NEW PROPOSAL</span>
        </div>
        <button onClick={onClose} className="text-dim hover:text-text transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Proposer */}
        <div>
          <FieldLabel>Proposer</FieldLabel>
          <div className="px-3 py-2 bg-surface border border-border text-xs font-mono text-dim break-all">
            {proposerAddress}
          </div>
        </div>

        {/* Kind selector */}
        <Select
          label="Proposal Type"
          value={form.kind}
          onChange={e => set('kind', e.target.value as FormKind)}
          options={[
            { value: 'Transfer',     label: '⟶  Transfer Funds' },
            { value: 'AddSigner',    label: '＋  Add Signer'     },
            { value: 'RemoveSigner', label: '－  Remove Signer'  },
          ]}
        />

        {/* Kind-specific fields */}
        {form.kind === 'Transfer' && (
          <div className="space-y-4 p-4 bg-surface/50 border border-border/60">
            <p className="text-xs font-mono text-dim tracking-widest uppercase">Transfer Details</p>
            <Input
              label="Recipient Address"
              placeholder="G..."
              value={form.recipient}
              onChange={e => set('recipient', e.target.value)}
              error={errors.recipient}
            />
            <Input
              label="Amount (XLM)"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              error={errors.amount}
            />
          </div>
        )}

        {(form.kind === 'AddSigner' || form.kind === 'RemoveSigner') && (
          <div className="space-y-4 p-4 bg-surface/50 border border-border/60">
            <p className="text-xs font-mono text-dim tracking-widest uppercase">
              {form.kind === 'AddSigner' ? 'New Signer' : 'Signer to Remove'}
            </p>
            <Input
              label="Signer Address"
              placeholder="G..."
              value={form.signerAddr}
              onChange={e => set('signerAddr', e.target.value)}
              error={errors.signerAddr}
            />
          </div>
        )}

        {/* Description */}
        <Textarea
          label="Description / Rationale"
          placeholder="Explain why this proposal should be approved by the DAO…"
          rows={4}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          error={errors.description}
        />
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border p-5">
        <div className="flex gap-3">
          <Button variant="ghost" size="md" onClick={onClose} className="flex-1">
            CANCEL
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            loading={submitting}
            className="flex-1"
          >
            SUBMIT PROPOSAL
          </Button>
        </div>
      </div>
    </div>
  );
}
