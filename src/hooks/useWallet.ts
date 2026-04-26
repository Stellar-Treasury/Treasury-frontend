'use client';
// hooks/useWallet.ts
// feat(wallet): integrate wallet connection
//
// Simulates Freighter wallet integration. In production, replace the
// connect() body with: import freighter from '@stellar/freighter-api'
// and call freighter.getPublicKey() after requestAccess().

import { useState, useCallback } from 'react';
import { WalletState } from '@/types';

const DEMO_ADDRESS = 'GABC1234STELLARTEST0000001AAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected:  false,
    address:    null,
    publicKey:  null,
    connecting: false,
    error:      null,
  });

  const connect = useCallback(async () => {
    setWallet(w => ({ ...w, connecting: true, error: null }));

    // Simulate async wallet handshake (replace with Freighter SDK call)
    await new Promise(res => setTimeout(res, 1200));

    // In production:
    //   const isAllowed = await freighter.isAllowed();
    //   if (!isAllowed) await freighter.setAllowed();
    //   const { publicKey } = await freighter.getAddress();

    setWallet({
      connected:  true,
      address:    DEMO_ADDRESS,
      publicKey:  DEMO_ADDRESS,
      connecting: false,
      error:      null,
    });
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      connected:  false,
      address:    null,
      publicKey:  null,
      connecting: false,
      error:      null,
    });
  }, []);

  const isSigner = useCallback((signerList: string[]) => {
    if (!wallet.address) return false;
    return signerList.includes(wallet.address);
  }, [wallet.address]);

  return { wallet, connect, disconnect, isSigner };
}
