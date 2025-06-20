'use client';

import { useState, useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/UserMenu.module.css';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Debug log pour tracer l'image côté client
  useEffect(() => {
    if (session) {
      console.log('🔍 DEBUG UserMenu - session data:', {
        userId: session.user?.id,
        userImage: session.user?.image,
        userName: session.user?.name,
        userRole: session.user?.role
      });
    }
  }, [session]);

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
      <div className={styles.menuItems} style={{ display: 'flex', gap: 12 }}>
        <Link href="/auth/login" className={styles.loginBtn}>
          Se connecter
        </Link>
        <Link href="/auth/register" className={styles.registerBtn}>
          S'inscrire
        </Link>
      </div>
    );
  }

  // Séparer les éléments du menu en fonction du rôle
  const renderMenuItems = () => {
    const commonItems = (
      <>
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
      </>
    );

    const adminItems = session.user.role === 'admin' ? (
      <button
        onClick={() => {
          router.push('/dashboard');
          setIsOpen(false);
        }}
        className={`${styles.menuItem} ${styles.adminItem}`}
      >
        Dashboard Admin
      </button>
    ) : null;

    return (
      <div className={styles.menuItems}>
        {commonItems}
        {adminItems}
      </div>
    );
  };

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
              {session.user.role === 'admin' && (
                <p className={styles.adminBadge}>Administrateur</p>
              )}
            </div>
          </div>
          {renderMenuItems()}
        </div>
      )}
    </div>
  );
}
