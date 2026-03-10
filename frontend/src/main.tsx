import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { useAuthStore } from '@/stores/authStore';
import '@/styles/index.css';

// Check if user is already authenticated on app load
function initializeAuth() {
  const state = useAuthStore.getState();
  if (state.accessToken && state.user) {
    useAuthStore.setState({ isAuthenticated: true });
  }
}

initializeAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
