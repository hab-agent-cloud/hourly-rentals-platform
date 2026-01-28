import * as React from 'react';
import { createRoot } from 'react-dom/client'
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App'
import './index.css'

function RootApp() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'yandex-verification';
    meta.content = 'e4f71593ff2478e9';
    document.head.appendChild(meta);

    // Регистрация Service Worker для PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((error) => {
            console.log('SW registration failed: ', error);
          });
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}

createRoot(document.getElementById("root")!).render(<RootApp />);