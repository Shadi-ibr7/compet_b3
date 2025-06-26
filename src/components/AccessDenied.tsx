import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/ErrorPages.module.css';

interface AccessDeniedProps {
  title?: string;
  description?: string;
  showLogin?: boolean;
}

export default function AccessDenied({ 
  title = "Accès refusé",
  description = "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
  showLogin = true 
}: AccessDeniedProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorHeader}>
          <div className={styles.errorCode}>403</div>
          <h1 className={styles.errorTitle}>
            {title} <span className={styles.highlight}>interdit !</span>
          </h1>
          <p className={styles.errorDescription}>
            {description}
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
              Accès restreint
            </div>
          </div>
        </div>

        <div className={styles.errorActions}>
          {showLogin ? (
            <Link href="/auth/signin" className={styles.primaryBtn}>
              🔑 Se connecter
            </Link>
          ) : (
            <Link href="/" className={styles.primaryBtn}>
              🏠 Retourner à l'accueil
            </Link>
          )}
          
          <div className={styles.secondaryActions}>
            <Link href="/" className={styles.secondaryBtn}>
              🏠 Accueil
            </Link>
            <Link href="/annonces" className={styles.secondaryBtn}>
              📋 Voir les annonces
            </Link>
            <Link href="/mentors" className={styles.secondaryBtn}>
              👥 Découvrir les mentors
            </Link>
          </div>
        </div>

        <div className={styles.helpSection}>
          <h3 className={styles.helpTitle}>Pourquoi cette restriction ?</h3>
          <div className={styles.helpCards}>
            <div className={styles.helpCard}>
              <strong>🔒 Contenu protégé</strong>
              <p>Cette page contient des informations réservées aux utilisateurs connectés.</p>
            </div>
            <div className={styles.helpCard}>
              <strong>👤 Profil incomplet</strong>
              <p>Vous devez peut-être compléter votre profil pour accéder à ce contenu.</p>
            </div>
            <div className={styles.helpCard}>
              <strong>🔑 Permissions requises</strong>
              <p>Contactez un administrateur si vous pensez avoir les droits d'accès.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}