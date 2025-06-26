import styles from '@/styles/ErrorPages.module.css';

export default function Loading() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorHeader}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <h1 className={styles.errorTitle}>
            Chargement en <span className={styles.highlight}>cours...</span>
          </h1>
          <p className={styles.errorDescription}>
            Veuillez patienter pendant que nous préparons votre contenu.
          </p>
        </div>
      </div>
    </div>
  );
}