import React, { useEffect } from 'react';
import { useWallet } from './hooks/useWallet';
import OnboardingScreen from './components/OnboardingScreen';
import MainAppScreen from './components/MainAppScreen';

const App: React.FC = () => {
  const { wallet, loading, generateNewWallet } = useWallet();

  useEffect(() => {
    console.log(wallet);
  }, [wallet]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return wallet ? <MainAppScreen /> : <OnboardingScreen generateWallet={generateNewWallet} />;
};

export default App;
