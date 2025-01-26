import React from 'react';
import { initSentry } from './utils/sentry';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

initSentry();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);