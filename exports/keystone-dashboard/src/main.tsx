import { createRoot } from 'react-dom/client';
import 'claude-comp-lib/styles.css';
import { App } from './App';
import './dashboard.scss';

createRoot(document.getElementById('root')!).render(<App />);
