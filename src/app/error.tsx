'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/ErrorPages.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionnel : Logger l'erreur en production
    console.error('Erreur capturée:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorHeader}>
          <div className={styles.errorCode}>Erreur</div>
          <h1 className={styles.errorTitle}>
            Quelque chose s'est <span className={styles.highlight}>mal passé !</span>
          </h1>
          <p className={styles.errorDescription}>
            Une erreur inattendue s'est produite. Notre équipe technique en a été informée 
            et travaille à résoudre le problème rapidement.
          </p>
        </div>

        <div className={styles.errorIllustration}>
          <div className={styles.illustrationBox}>
            <Image 
              src="/Vector_Stroke.svg" 
              alt="" 
              width={80} 
              height={55} 
              className={styles.illustrationIcon}
            />
            <div className={styles.illustrationText}>
              Erreur technique
            </div>
          </div>
        </div>

        <div className={styles.errorActions}>
          <button onClick={reset} className={styles.primaryBtn}>
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

        <div className={styles.errorDetails}>
          <details className={styles.technicalDetails}>
            <summary className={styles.detailsSummary}>
              🔧 Détails techniques (pour les développeurs)
            </summary>
            <div className={styles.detailsContent}>
              <p><strong>Message d'erreur :</strong></p>
              <code className={styles.errorCode}>{error.message}</code>
              {error.digest && (
                <>
                  <p><strong>ID d'erreur :</strong></p>
                  <code className={styles.errorCode}>{error.digest}</code>
                </>
              )}
            </div>
          </details>
        </div>

        <div className={styles.helpSection}>
          <h3 className={styles.helpTitle}>Que faire maintenant ?</h3>
          <div className={styles.helpCards}>
            <div className={styles.helpCard}>
              <strong>🔄 Première étape</strong>
              <p>Cliquez sur "Réessayer" - le problème peut être temporaire.</p>
            </div>
            <div className={styles.helpCard}>
              <strong>🌐 Problème persistant ?</strong>
              <p>Vérifiez votre connexion internet et rafraîchissez la page.</p>
            </div>
            <div className={styles.helpCard}>
              <strong>📞 Support technique</strong>
              <p>Si le problème persiste, contactez notre équipe support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}