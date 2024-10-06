import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from './onboarding/Header';
import { MnemonicDisplay } from './onboarding/MnemonicDisplay';
import { ImportPhrase } from './onboarding/ImportPhrase';
import { TabsContent } from './onboarding/TabContent';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { redirect, useNavigate } from 'react-router-dom';
//@ts-ignore
import confetti from 'canvas-confetti';

export default function Onboarding() {
  const [activeTab, setActiveTab] = useState('create');
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [importedPhrase, setImportedPhrase] = useState<string[]>(Array(12).fill(''));
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  const { generateNewMnemonic, importExistingWallet } = useWallet();
  const navigate = useNavigate();



  useEffect(() => {
    const introFlag = localStorage.getItem('hasSeenIntro');
    setHasSeenIntro(!!introFlag);
  }, []);


  useEffect(() => {
    handleRegenerateMnemonic();
    document.documentElement.classList.add('dark');
  }, []);

  if (!hasSeenIntro) {
    redirect('/intro');
  }
  const handleRegenerateMnemonic = async () => {
    const mnemonics = await generateNewMnemonic();
    setMnemonic(mnemonics.split(' '));
  };

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic.join(' '));
    setCopied(true);
    toast({
      title: 'Seed phrase copied!',
      description: 'Your seed phrase has been copied to the clipboard.',
    });
  };

  const handleImportedPhraseChange = (index: number, value: string) => {
    const newPhrase = [...importedPhrase];

    if (value.trim().split(' ').length > 1) {
      const pastedWords = value.trim().split(' ').slice(0, 12);
      console.log(pastedWords);
      setImportedPhrase(pastedWords);
    } else {
      newPhrase[index] = value;
      setImportedPhrase(newPhrase);
    }

    if (value && index < 11) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const importProgress = (importedPhrase.filter((word) => word.trim() !== '').length / 12) * 100;

  const handleCreateWallet = async () => {
    const mnemonicPhrase = mnemonic.join(' ');
    await importExistingWallet(mnemonicPhrase);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    navigate('/app');
  };

  const handleImportWallet = async () => {
    try {
      const mnemonicPhrase = importedPhrase.join(' ');
      await importExistingWallet(mnemonicPhrase);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      navigate('/app');
    } catch (error) {
      console.error('Error importing wallet:', error);
      toast({
        title: 'Error',
        description: 'Invalid seed phrase. Please check and try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300 dark ${isDarkMode ? 'dark' : ''}`}>
      <Card className="w-full max-w-md overflow-hidden shadow-lg relative">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <CardContent className="p-6">
          <TabsContent activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'create' && (
              <MnemonicDisplay
                mnemonic={mnemonic}
                copied={copied}
                handleCopyMnemonic={handleCopyMnemonic}
                handleRegenerateMnemonic={handleRegenerateMnemonic}
              />
            )}
            {activeTab === 'import' && (
              <ImportPhrase
                importedPhrase={importedPhrase}
                inputRefs={inputRefs}
                handleImportedPhraseChange={handleImportedPhraseChange}
                importProgress={importProgress}
              />
            )}
          </TabsContent>
        </CardContent>
        <CardFooter className="bg-muted p-6">
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full" onClick={activeTab === 'create' ? handleCreateWallet : handleImportWallet}>
              {activeTab === 'create' ? 'Create Wallet' : 'Import Wallet'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  );
}
