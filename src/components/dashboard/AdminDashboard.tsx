'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminArticlesSection from './AdminArticlesSection';
import styles from '@/styles/AdminDashboard.module.css';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [session, status]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement du tableau de bord administrateur...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Tableau de bord administrateur</h1>
          <div className={styles.userInfo}>
            <span>{session.user.email}</span>
            <Image
              src={session.user.image || '/placeholder_pp.png'}
              alt="Admin avatar"
              width={40}
              height={40}
              className={styles.avatar}
            />
          </div>
        </div>
        <div className={styles.grid}>
          {/* Section Utilisateurs */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Gestion des Utilisateurs</h2>
            </div>
            <p className={styles.description}>
              Gérez les comptes utilisateurs et leurs rôles
            </p>
          </div>

          {/* Section Analytics */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Analytics</h2>
            </div>
            <p className={styles.description}>
              Consultez les statistiques de la plateforme
            </p>
          </div>
        </div>

        {/* Section Articles agrandie */}
        <AdminArticlesSection />
      </main>
    </div>
  );
}