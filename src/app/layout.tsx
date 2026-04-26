// src/app/layout.tsx
import type { Metadata } from 'next';
import { DM_Sans, Space_Mono, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title:       'DAO Treasury | Multisig Dashboard',
  description: 'Stellar Soroban DAO treasury multisignature management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-void text-text font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
