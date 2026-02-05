
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
    console.error("Render xatoligi:", err);
    // Fixed: Escaped the single quote in 'Noma\'lum' to avoid breaking the string literal inside the template expression
    rootElement.innerHTML = `<div style="color: white; padding: 20px; text-align: center;">
      <h1>Dasturni yuklashda xatolik yuz berdi</h1>
      <p>${err instanceof Error ? err.message : 'Noma\'lum xato'}</p>
    </div>`;
  }
}
