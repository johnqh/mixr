import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Initialize storage and network services BEFORE importing App
import { initializeStorageService, initializeNetworkService } from '@sudobility/di_web';
initializeStorageService();
initializeNetworkService();

// Import App AFTER service initialization
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
