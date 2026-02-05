
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Root element topilmadi!");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Ilovani ishga tushirishda xatolik:", err);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background-color: #020617; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #ef4444; margin-bottom: 20px;">Dastur yuklanmadi</h1>
        <p style="color: #94a3b8; max-width: 500px; line-height: 1.6;">Xatolik tafsilotlari pastda ko'rsatilgan. Brauzer konsolini tekshiring.</p>
        <pre style="background: #1e293b; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #60a5fa; white-space: pre-wrap; word-break: break-all;">${err instanceof Error ? err.message : 'Noma\'lum xato'}</pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Qayta yuklash</button>
      </div>
    `;
  }
}
