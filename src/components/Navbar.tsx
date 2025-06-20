"use client";
import styles from '@/styles/Navbar.module.css';
import { useState } from 'react';
import UserMenu from './UserMenu';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Trouver un job', href: '/jobs' },
  { label: 'On vous accompagne !', href: '/accompagnement' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoWrapper}>
        <Link href="/">
          <Image src="/logo.svg" alt="Molty" width={120} height={40} />
        </Link>
      </div>
      <div className={styles.linksWrapper}>
        <Link href="/" className={styles.navLink}>Accueil</Link>
        <Link href="/jobs" className={styles.navLink}>Annonces</Link>
        <Link href="/blog" className={styles.navLink}>Blog</Link>
        <Link href="/faq" className={styles.navLink}>FAQ</Link>
      </div>
      <div className={styles.authWrapper}>
        {!session ? (
          <>
            <button className={styles.loginBtn} onClick={() => signIn()}>Se connecter</button>
            <Link href="/register" className={styles.signupBtn}>S'inscrire</Link>
          </>
        ) : (
          <div className={styles.avatarMenu}>
            <Image src={session.user?.image || "/avatar.svg"} alt="avatar" width={40} height={40} className={styles.avatarImg} />
          </div>
        )}
      </div>
      {/* Desktop nav */}
      <ul className={styles.linksDesktop}>
        {LINKS.map(link => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
        <li style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {session ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/auth/signin" className={styles.loginBtn}>
                Se connecter
              </Link>
              <Link href="/auth/signup" className={styles.registerBtn}>
                S'inscrire
              </Link>
            </>
          )}
        </li>
      </ul>
      {/* Mobile burger */}
      <button className={styles.burger} onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
        <span className={styles.burgerBar}></span>
        <span className={styles.burgerBar}></span>
        <span className={styles.burgerBar}></span>
      </button>
      {/* Mobile menu */}
      {open && (
        <div className={styles.mobileMenu}>
          <button className={styles.close} onClick={() => setOpen(false)} aria-label="Fermer le menu">×</button>
          <ul>
            {LINKS.map(link => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
              </li>
            ))}
            <li className={styles.mobileUserMenu}>
              <UserMenu />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 