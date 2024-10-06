import React, { createContext, useContext } from 'react';
import { useChainPassService } from '../services/chainPassService';

const ChainPassContext = createContext<any>(null);

export const ChainPassProvider: React.FC = ({ children }) => {
  const service = useChainPassService();

  return (
    <ChainPassContext.Provider value={service}>
      {children}
    </ChainPassContext.Provider>
  );
};

export const useChainPass = () => {
  const context = useContext(ChainPassContext);
  if (!context) {
    throw new Error("useChainPass must be used within a ChainPassProvider");
  }
  return context;
};
