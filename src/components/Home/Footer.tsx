import type { NextPage } from 'next';
import Image from 'next/image';
import styles from "@/styles/Footer.module.css";

const Footer: NextPage = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <Image className={styles.logo} width={85.5} height={40} alt="Molty" src="/Logotype.svg" />
        </div>
        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>Contact</div>
          <div className={styles.footerContactBlock}>
            <div className={styles.footerIcons}>
              <Image className={styles.vectorIcon} width={16} height={16} alt="" src="/logoinsta.svg" />
              <Image className={styles.unionIcon} width={20} height={16} alt="" src="/logoyt.svg" />
            </div>
            <div className={styles.footerContact}>contact@molty.com</div>
            <div className={styles.footerPhone}>01 65 23 45 66</div>
          </div>
        </div>
        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>À propos</div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Conditions générales</a>
            <a href="#" className={styles.footerLink}>Mentions légales</a>
            <a href="#" className={styles.footerLink}>Gérer mes préférences</a>
            <a href="#" className={styles.footerLink}>Cookies</a>
          </div>
        </div>
        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>Menu</div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Accueil</a>
            <a href="#" className={styles.footerLink}>Annonces</a>
            <a href="#" className={styles.footerLink}>Mentors</a>
            <a href="#" className={styles.footerLink}>Créer mon avenir</a>
            <a href="#" className={styles.footerLink}>Blog</a>
            <a href="#" className={styles.footerLink}>À propos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 