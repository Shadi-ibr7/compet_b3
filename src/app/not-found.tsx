import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/ErrorPages.module.css';

export default function NotFound() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorHeader}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.errorTitle}>
            Oups ! Cette page s'est <span className={styles.highlight}>perdue en route.</span>
          </h1>
          <p className={styles.errorDescription}>
            La page que vous recherchez n'existe pas ou a été déplacée. 
            Mais ne vous inquiétez pas, nous allons vous aider à retrouver votre chemin !
          </p>
        </div>

        <div className={styles.errorIllustration}>
          <div className={styles.illustrationBox}>
            <Image 
              src="/Union.svg" 
              alt="" 
              width={80} 
              height={96} 
              className={styles.illustrationIcon}
            />
            <div className={styles.illustrationText}>
              Commerce introuvable
            </div>
          </div>
        </div>

        <div className={styles.errorActions}>
          <Link href="/" className={styles.primaryBtn}>
            🏠 Retourner à l'accueil
          </Link>
          
          <div className={styles.secondaryActions}>
            <Link href="/annonces" className={styles.secondaryBtn}>
              📋 Voir les annonces
            </Link>
            <Link href="/mentors" className={styles.secondaryBtn}>
              👥 Découvrir les mentors
            </Link>
            <Link href="/blog" className={styles.secondaryBtn}>
              📝 Lire le blog
            </Link>
          </div>
        </div>

        <div className={styles.helpSection}>
          <h3 className={styles.helpTitle}>Vous cherchiez quelque chose de spécifique ?</h3>
          <div className={styles.helpCards}>
            <div className={styles.helpCard}>
              <strong>📱 Problème technique ?</strong>
              <p>Essayez de rafraîchir la page ou vérifiez votre connexion internet.</p>
            </div>
            <div className={styles.helpCard}>
              <strong>🔍 Page supprimée ?</strong>
              <p>Le contenu a peut-être été déplacé. Utilisez la recherche pour le retrouver.</p>
            </div>
            <div className={styles.helpCard}>
              <strong>💬 Besoin d'aide ?</strong>
              <p>Contactez-nous si vous ne trouvez pas ce que vous cherchez.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}