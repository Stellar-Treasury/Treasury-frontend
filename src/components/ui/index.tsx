'use client';
// components/ui/index.tsx
// refactor(ui): extract reusable components
// Atomic primitives used throughout the dashboard.

import React from 'react';
import { clsx } from 'clsx';
import { ProposalStatus } from '@/types';

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sz = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-7 h-7' }[size];
  return (
    <span className={clsx('inline-block border-2 border-cyan/30 border-t-cyan rounded-full animate-spin', sz)} />
  );
}

// ── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  size?:    'sm' | 'md' | 'lg';
  loading?: boolean;
}
export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-mono font-medium tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-cyan text-void hover:bg-cyan/90 active:scale-95 shadow-[0_0_16px_rgba(0,212,255,0.3)]',
    ghost:   'text-dim hover:text-text hover:bg-muted active:scale-95',
    danger:  'bg-rose/10 text-rose border border-rose/30 hover:bg-rose/20 active:scale-95',
    outline: 'border border-border text-text hover:border-cyan/50 hover:text-cyan active:scale-95',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  status: ProposalStatus | string;
  pulse?: boolean;
}
export function StatusBadge({ status, pulse }: BadgeProps) {
  const config: Record<string, { dot: string; bg: string; text: string; label: string }> = {
    Pending:   { dot: 'bg-amber', bg: 'bg-amber/10', text: 'text-amber',  label: 'PENDING'   },
    Executed:  { dot: 'bg-lime',  bg: 'bg-lime/10',  text: 'text-lime',   label: 'EXECUTED'  },
    Cancelled: { dot: 'bg-rose',  bg: 'bg-rose/10',  text: 'text-rose',   label: 'CANCELLED' },
  };
  const c = config[status] ?? { dot: 'bg-dim', bg: 'bg-muted', text: 'text-dim', label: status.toUpperCase() };
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono tracking-widest', c.bg, c.text)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', c.dot, pulse && status === 'Pending' && 'animate-pulse')} />
      {c.label}
    </span>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className, glow }: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={clsx(
      'bg-panel border border-border',
      glow && 'shadow-[0_0_24px_rgba(0,212,255,0.06)]',
      className
    )}>
      {children}
    </div>
  );
}

// ── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={clsx('border-t border-border', className)} />;
}

// ── Label ────────────────────────────────────────────────────────────────────
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block mb-1.5 text-xs font-mono tracking-widest text-dim uppercase">
      {children}
    </span>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <FieldLabel>{label}</FieldLabel>}
      <input
        className={clsx(
          'w-full bg-surface border border-border px-3 py-2 text-sm font-mono text-text',
          'placeholder:text-subtle focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20',
          'transition-colors duration-150',
          error && 'border-rose/50 focus:border-rose/50',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose font-mono">{error}</span>}
    </div>
  );
}

// ── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <FieldLabel>{label}</FieldLabel>}
      <textarea
        className={clsx(
          'w-full bg-surface border border-border px-3 py-2 text-sm font-mono text-text resize-none',
          'placeholder:text-subtle focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20',
          'transition-colors duration-150',
          error && 'border-rose/50',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose font-mono">{error}</span>}
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}
export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <FieldLabel>{label}</FieldLabel>}
      <select
        className={clsx(
          'w-full bg-surface border border-border px-3 py-2 text-sm font-mono text-text',
          'focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20',
          'transition-colors duration-150',
          className
        )}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent }: {
  label: string;
  value: string;
  sub?: string;
  accent?: 'cyan' | 'teal' | 'amber' | 'lime';
}) {
  const colors = {
    cyan:  'text-cyan',
    teal:  'text-teal',
    amber: 'text-amber',
    lime:  'text-lime',
  };
  return (
    <Card className="p-5">
      <p className="text-xs font-mono tracking-widest text-dim uppercase mb-2">{label}</p>
      <p className={clsx('text-2xl font-mono font-bold', accent ? colors[accent] : 'text-bright')}>{value}</p>
      {sub && <p className="text-xs text-dim font-mono mt-1">{sub}</p>}
    </Card>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 border border-border flex items-center justify-center mb-4">
        <span className="text-2xl text-dim">⬡</span>
      </div>
      <p className="text-sm font-mono text-dim tracking-wider">{title}</p>
      {description && <p className="text-xs text-subtle mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
