import { useState, useEffect } from 'react';
import { generateMnemonics, getWalletFromStorage, importWalletFromMnemonics, hasWallet, removeWalletFromStore } from '../services/wallet';
import { Wallet } from 'ethers';

interface WalletHook {
  wallet: Wallet | null;
  mnemonics: string | null;
  loading: boolean;
  generateNewWallet: () => Promise<void>;
  removeWallet: () => Promise<void>;
}

export const useWallet = (): WalletHook => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [mnemonics, setMnemonics] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeWallet = async () => {
      const walletExists = await hasWallet();
      if (walletExists) {
        const storedWallet = await getWalletFromStorage();
        if (storedWallet) {
          setMnemonics(storedWallet.mnemonics);
          setWallet(storedWallet.wallet);
        }
      }
      setLoading(false);
    };

    initializeWallet();
  }, []);

  const removeWallet = async() => {
    await removeWalletFromStore();
    setMnemonics(null);
    setWallet(null);
  }

  const generateNewWallet = async () => {
    const newMnemonics = await generateMnemonics();
    setMnemonics(newMnemonics);
    const importedWallet = await importWalletFromMnemonics(newMnemonics);
    setWallet(importedWallet);
  };

  return { wallet, mnemonics, loading, generateNewWallet, removeWallet };
};
