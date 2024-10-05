// src/components/Header.tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <CardHeader className="bg-primary text-primary-foreground p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardTitle className="text-2xl font-bold text-center">Welcome to ChainPass</CardTitle>
        <CardDescription className="text-center text-primary-foreground/80">
            No more centralised password-managers.
        </CardDescription>
      </motion.div>
      <motion.div
        className="absolute top-4 right-4 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </motion.div>
    </CardHeader>
  );
};
