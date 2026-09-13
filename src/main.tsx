import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in MINE-INTEL:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2rem', maxWidth: '600px', width: '100%', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <h2 style={{ color: '#ef4444', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Application Error Encountered</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>The application encountered an unexpected state. You can reset to the Login page below:</p>
            <pre style={{ background: '#0f172a', color: '#f87171', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.75rem', overflowX: 'auto', margin: '0 0 1.5rem 0' }}>
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Reset Session & Return to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
