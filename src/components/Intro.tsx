import React, { useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; 

const Intro: React.FC = () => {
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  useEffect(() => {
    const introFlag = localStorage.getItem('hasSeenIntro');
    setHasSeenIntro(!!introFlag);
  }, []);

  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    navigate('/onboarding');
  };

  if (hasSeenIntro) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to ChainPass!</h1>
      <p className="mb-6">We need content for this :D </p>
      <Button onClick={() => handleContinue()}>Continue</Button>
    </div>
  );
};

export default Intro;
