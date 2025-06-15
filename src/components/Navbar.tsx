"use client";
import styles from '@/styles/Navbar.module.css';
import { useState } from 'react';

const LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Trouver un job', href: '/jobs' },
  { label: 'On vous accompagne !', href: '/accompagnement' },
  { label: 'Se connecter', href: '/login', special: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      {/* Desktop nav */}
      <ul className={styles.linksDesktop}>
        {LINKS.map(link => (
          <li key={link.label}>
            <a href={link.href} className={link.special ? styles.special : ''}>{link.label}</a>
          </li>
        ))}
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
                <a href={link.href} className={link.special ? styles.special : ''} onClick={() => setOpen(false)}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 