import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('Mounting App');
const rootElement = document.getElementById('root');
console.log('Root Element found:', rootElement);
createRoot(rootElement!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
