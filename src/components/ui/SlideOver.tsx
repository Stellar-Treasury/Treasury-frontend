'use client';

import { useEffect } from 'react';
import { clsx } from 'clsx';

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SlideOver({ open, onClose, children, className }: SlideOverProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      <section
        className={clsx(
          'fixed right-0 top-0 z-50 h-full w-full max-w-md bg-panel border-l border-border shadow-2xl',
          'flex flex-col overflow-hidden animate-slide-in-right',
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </section>
    </>
  );
}
