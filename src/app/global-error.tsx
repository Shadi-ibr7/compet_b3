'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/ErrorPages.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{ background: '#fefff3' }}>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorHeader}>
              <div className={styles.errorCode}>Erreur Critique</div>
              <h1 className={styles.errorTitle}>
                Une erreur <span className={styles.highlight}>critique</span> s'est produite !
              </h1>
              <p className={styles.errorDescription}>
                L'application a rencontré une erreur majeure et ne peut pas continuer. 
                Veuillez rafraîchir la page ou réessayer plus tard.
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
                  Erreur système
                </div>
              </div>
            </div>

            <div className={styles.errorActions}>
              <button onClick={reset} className={styles.primaryBtn}>
                🔄 Réessayer
              </button>
              
              <div className={styles.secondaryActions}>
                <button 
                  onClick={() => window.location.href = '/'} 
                  className={styles.secondaryBtn}
                >
                  🏠 Retourner à l'accueil
                </button>
                <button 
                  onClick={() => window.location.reload()} 
                  className={styles.secondaryBtn}
                >
                  ↻ Rafraîchir la page
                </button>
              </div>
            </div>

            <div className={styles.helpSection}>
              <h3 className={styles.helpTitle}>Cette erreur est critique</h3>
              <div className={styles.helpCards}>
                <div className={styles.helpCard}>
                  <strong>🚨 Erreur système</strong>
                  <p>Une erreur au niveau de l'application empêche son fonctionnement normal.</p>
                </div>
                <div className={styles.helpCard}>
                  <strong>🔧 Solution immédiate</strong>
                  <p>Rafraîchissez la page ou revenez à l'accueil pour continuer.</p>
                </div>
                <div className={styles.helpCard}>
                  <strong>📞 Support urgent</strong>
                  <p>Si le problème persiste, contactez immédiatement notre support technique.</p>
                </div>
              </div>
            </div>

            {error.digest && (
              <div className={styles.errorDetails}>
                <details className={styles.technicalDetails}>
                  <summary className={styles.detailsSummary}>
                    🔧 Informations techniques
                  </summary>
                  <div className={styles.detailsContent}>
                    <p><strong>ID d'erreur :</strong></p>
                    <code>{error.digest}</code>
                    <p><strong>Message :</strong></p>
                    <code>{error.message}</code>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}