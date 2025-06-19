'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/UserMenu.module.css';

export default function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!session) {
    return (
      <button
        onClick={() => router.push('/auth/signin')}
        className={styles.signInButton}
      >
        Se connecter
      </button>
    );
  }

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        className={styles.avatarButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu utilisateur"
      >
        <Image
          src={session.user.image || '/placeholder_pp.png'}
          alt="Avatar"
          width={40}
          height={40}
          className={styles.avatar}
        />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.userInfo}>
            <Image
              src={session.user.image || '/placeholder_pp.png'}
              alt="Avatar"
              width={48}
              height={48}
              className={styles.menuAvatar}
            />
            <div className={styles.userDetails}>
              <p className={styles.userName}>{session.user.name}</p>
              <p className={styles.userEmail}>{session.user.email}</p>
            </div>
          </div>
          
          <div className={styles.menuItems}>
            <button
              onClick={() => {
                router.push('/dashboard');
                setIsOpen(false);
              }}
              className={styles.menuItem}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                signOut({ callbackUrl: '/' });
                setIsOpen(false);
              }}
              className={`${styles.menuItem} ${styles.signOut}`}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 