import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Send the default Vercel URL to the custom domain so only the real domain shows.
const CANONICAL_HOST = 'vidyaeducationalsociety.com';
if (
  window.location.hostname.endsWith('.vercel.app') &&
  window.location.hostname !== CANONICAL_HOST
) {
  window.location.replace(
    `https://${CANONICAL_HOST}${window.location.pathname}${window.location.search}${window.location.hash}`
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
