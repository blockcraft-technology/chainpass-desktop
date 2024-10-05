// MainAppScreen.tsx
import React from 'react';
import { useWallet } from '../hooks/useWallet';


const MainAppScreen: React.FC = () => {
  const { wallet,removeWallet } = useWallet();
  return (
    <div>
      <h1>Wallet Address: {wallet?.address}</h1>
      <button onClick={removeWallet}>remove wallet</button>
    </div>
  );
};

export default MainAppScreen;