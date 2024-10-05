import { ethers, Wallet } from 'ethers';
import { generateMnemonic } from 'bip39';
import { createStore } from '@tauri-apps/plugin-store';

const store = await createStore('.settings.dat');
const MNEMONICS_KEY = 'mnemonics';
const PRIVATE_KEY_KEY = 'privateKey';

export interface WalletData {
  mnemonics: string;
  wallet: Wallet;
}

export const generateMnemonics = async (): Promise<string> => {
  const mnemonics = generateMnemonic();
  await store.set(MNEMONICS_KEY, mnemonics);
  return mnemonics;
};

export const importWalletFromMnemonics = async (mnemonics: string): Promise<Wallet> => {
  try {
    const hdWallet = ethers.Wallet.fromPhrase(mnemonics);
    const wallet = hdWallet.deriveChild(0);
    await store.set(MNEMONICS_KEY, mnemonics);
    await store.set(PRIVATE_KEY_KEY, wallet.privateKey);
    return new Wallet(wallet.privateKey);
  } catch (error) {
    console.error('Invalid mnemonics', error);
    throw new Error('Invalid mnemonics');
  }
};

export const removeWalletFromStore = async() => {
    await store.delete(MNEMONICS_KEY);
    await store.delete(PRIVATE_KEY_KEY);
}

export const getWalletFromStorage = async (): Promise<WalletData | null> => {
  const mnemonics = await store.get<string>(MNEMONICS_KEY);
  const privateKey = await store.get<string>(PRIVATE_KEY_KEY);

  if (mnemonics && privateKey) {
    return {
      mnemonics,
      wallet: new ethers.Wallet(privateKey),
    };
  }

  return null;
};

export const hasWallet = async (): Promise<boolean> => {
  const mnemonics = await store.get<string>(MNEMONICS_KEY);
  return !!mnemonics;
};
