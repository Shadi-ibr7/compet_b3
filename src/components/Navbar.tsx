"use client";
import styles from '@/styles/Navbar.module.css';
import { useState } from 'react';
import UserMenu from './UserMenu';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const navigationLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Annonces', href: '/annonces' },
    { label: 'Mentors', href: '/mentors' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <nav className={styles.navbar}>
      {/* Desktop navigation */}
      <ul className={styles.linksDesktop}>
        {navigationLinks.map(link => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
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
            {navigationLinks.map(link => (
              <li key={link.label}>
                <Link href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
              </li>
            ))}
            <li className={styles.mobileUserMenu}>
              {session ? (
                <UserMenu />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link href="/auth/signin" className={styles.loginBtn} onClick={() => setOpen(false)}>
                    Se connecter
                  </Link>
                  <Link href="/auth/signup" className={styles.registerBtn} onClick={() => setOpen(false)}>
                    S'inscrire
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 