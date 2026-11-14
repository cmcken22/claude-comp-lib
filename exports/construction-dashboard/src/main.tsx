import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'claude-comp-lib/styles.css';
import './styles/dashboard.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
