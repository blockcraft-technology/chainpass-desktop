// OnboardingScreen.tsx
import React from 'react';

interface OnboardingScreenProps {
  generateWallet: () => Promise<void>;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ generateWallet }) => {
  return (
    <div>
      <h1>Welcome to the App!</h1>
      <button onClick={generateWallet}>Generate Wallet</button>
    </div>
  );
};

export default OnboardingScreen;
