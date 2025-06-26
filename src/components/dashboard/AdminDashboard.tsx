'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdminArticlesSection from './AdminArticlesSection';
import styles from '@/styles/AdminDashboard.module.css';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalAnnonces: 0,
    totalArticles: 0
  });

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(false);
      // Charger les statistiques
      loadStats();
    }
  }, [session, status]);

  const loadStats = async () => {
    try {
      // Ici on pourrait charger de vraies statistiques depuis l'API
      // Pour l'instant, on simule des données
      setStats({
        totalUsers: 156,
        totalMentors: 23,
        totalAnnonces: 45,
        totalArticles: 12
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Chargement du tableau de bord administrateur...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Accès refusé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <Link href="/" className={styles.backButton}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Accueil</Link>
        <span className={styles.breadcrumbSeparator}>•</span>
        <span className={styles.breadcrumbCurrent}>Administration</span>
      </nav>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.adminBadge}>
              <span className={styles.badgeIcon}>⚡</span>
              <span>Administrateur</span>
            </div>
            <h1 className={styles.heroTitle}>Tableau de bord</h1>
            <p className={styles.heroSubtitle}>
              Gérez efficacement votre plateforme Molty
            </p>
          </div>
          <div className={styles.heroProfile}>
            <div className={styles.profileInfo}>
              <Image
                src={session.user.image || '/placeholder_pp.png'}
                alt="Admin avatar"
                width={60}
                height={60}
                className={styles.profileAvatar}
              />
              <div className={styles.profileDetails}>
                <h3 className={styles.profileName}>{session.user.name}</h3>
                <p className={styles.profileEmail}>{session.user.email}</p>
                <div className={styles.statusBadge}>
                  <span className={styles.statusDot}></span>
                  <span>En ligne</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>Vue d'ensemble</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.totalUsers}</div>
              <div className={styles.statLabel}>Utilisateurs</div>
            </div>
            <div className={styles.statTrend}>
              <span className={styles.trendUp}>+12%</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.totalMentors}</div>
              <div className={styles.statLabel}>Mentors</div>
            </div>
            <div className={styles.statTrend}>
              <span className={styles.trendUp}>+8%</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💼</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.totalAnnonces}</div>
              <div className={styles.statLabel}>Annonces</div>
            </div>
            <div className={styles.statTrend}>
              <span className={styles.trendUp}>+15%</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📰</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{stats.totalArticles}</div>
              <div className={styles.statLabel}>Articles</div>
            </div>
            <div className={styles.statTrend}>
              <span className={styles.trendUp}>+5%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Management Section */}
      <section className={styles.managementSection}>
        <h2 className={styles.sectionTitle}>Gestion de la plateforme</h2>
        <div className={styles.managementGrid}>
          {/* Section Utilisateurs */}
          <div className={styles.managementCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>👥</div>
              <div className={styles.cardTitleGroup}>
                <h3 className={styles.cardTitle}>Gestion des Utilisateurs</h3>
                <p className={styles.cardDescription}>
                  Gérez les comptes utilisateurs et leurs rôles
                </p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.primaryButton}>
                Voir tous les utilisateurs
              </button>
              <button className={styles.secondaryButton}>
                Ajouter un utilisateur
              </button>
            </div>
          </div>

          {/* Section Mentors */}
          <div className={styles.managementCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>🎯</div>
              <div className={styles.cardTitleGroup}>
                <h3 className={styles.cardTitle}>Gestion des Mentors</h3>
                <p className={styles.cardDescription}>
                  Validez et gérez les profils des mentors
                </p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <Link href="/mentors" className={styles.primaryButton}>
                Voir tous les mentors
              </Link>
              <button className={styles.secondaryButton}>
                Demandes en attente
              </button>
            </div>
          </div>

          {/* Section Annonces */}
          <div className={styles.managementCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>💼</div>
              <div className={styles.cardTitleGroup}>
                <h3 className={styles.cardTitle}>Gestion des Annonces</h3>
                <p className={styles.cardDescription}>
                  Modérez et gérez les offres d'emploi
                </p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <Link href="/annonces" className={styles.primaryButton}>
                Voir toutes les annonces
              </Link>
              <button className={styles.secondaryButton}>
                Signalements
              </button>
            </div>
          </div>

          {/* Section Analytics */}
          <div className={styles.managementCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>📊</div>
              <div className={styles.cardTitleGroup}>
                <h3 className={styles.cardTitle}>Analytics</h3>
                <p className={styles.cardDescription}>
                  Consultez les statistiques détaillées
                </p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.primaryButton}>
                Voir les analytics
              </button>
              <button className={styles.secondaryButton}>
                Exporter les données
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <AdminArticlesSection />
    </div>
  );
}