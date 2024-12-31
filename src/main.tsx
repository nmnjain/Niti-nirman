import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
