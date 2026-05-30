import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { subscribeToTheme } from '@/lib/themeService';
import './index.css';
import '@/styles/nahkya-v10.css';
import App from './App';

gsap.registerPlugin(ScrollTrigger);

// ── Theme hydration (runs before React mounts) ──
useAppearanceStore.getState().initTheme();

// Live subscription: admin color changes propagate to all open sessions
subscribeToTheme((tokens) => {
  if (Object.keys(tokens).length > 0) {
    useAppearanceStore.setState({ tokens });
    useAppearanceStore.getState().applyAllTokens();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
