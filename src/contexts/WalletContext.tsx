import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Wallet } from 'ethers';
import {
  generateMnemonics,
  importWalletFromMnemonics,
  getWalletFromStorage,
  hasWallet,
  removeWalletFromStore,
} from '../services/wallet';

interface WalletContextProps {
  wallet: Wallet | null;
  mnemonics: string | null;
  loading: boolean;
  generateNewMnemonic: () => Promise<string>;
  importExistingWallet: (mnemonics: string) => Promise<void>;
  removeWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextProps | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
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
    setMnemonics(null);
    setWallet(null);
    await removeWalletFromStore();
  }

  const importExistingWallet = async (mnemonics: string) => {
    const importedWallet = await importWalletFromMnemonics(mnemonics);
    setMnemonics(mnemonics);
    setWallet(importedWallet);
  };

  const generateNewMnemonic = async() => {
    return generateMnemonics();
  }

  return (
    <WalletContext.Provider
      value={{ wallet, mnemonics, loading, generateNewMnemonic, importExistingWallet, removeWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};
