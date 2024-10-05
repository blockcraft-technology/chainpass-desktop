import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWallet } from './hooks/useWallet';
import MainAppScreen from './components/MainAppScreen';
import Onboarding from './components/Onboarding';
import Intro from './components/Intro'; 
import './index.css';

const App: React.FC = () => {
  const { wallet, loading } = useWallet();

  if (loading) {
    return <div></div>;
  }

  return (
    <Routes>
      { wallet ? (
        <>
          <Route path="/app" element={<MainAppScreen />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </>
      ) : (
        <>
          <Route path="/intro" element={<Intro />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<Navigate to="/intro" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;
