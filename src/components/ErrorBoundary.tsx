'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/ErrorPages.module.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorHeader}>
              <div className={styles.errorCode}>Composant</div>
              <h2 className={styles.errorTitle}>
                Une erreur s'est <span className={styles.highlight}>produite</span>
              </h2>
              <p className={styles.errorDescription}>
                Ce composant a rencontré une erreur et ne peut pas s'afficher correctement.
              </p>
            </div>

            <div className={styles.errorActions}>
              <button 
                onClick={() => this.setState({ hasError: false })} 
                className={styles.primaryBtn}
              >
                🔄 Réessayer
              </button>
              
              <div className={styles.secondaryActions}>
                <Link href="/" className={styles.secondaryBtn}>
                  🏠 Retourner à l'accueil
                </Link>
                <button 
                  onClick={() => window.location.reload()} 
                  className={styles.secondaryBtn}
                >
                  ↻ Rafraîchir la page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;