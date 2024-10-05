import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WalletProvider } from './contexts/WalletContext';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WalletProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
