'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getMentorRating } from '@/lib/ratingService';
import { useSafeInput } from '@/hooks/useSafeInput';
import { sanitizeProfile, sanitizeHtml } from '@/lib/security';
import type { IAnnonce } from '@/types/interfaces/annonce.interface';
import type { IMentor } from '@/types/interfaces/mentor.interface';
import type { IMentorRating } from '@/types/interfaces/rating.interface';
import MentorProfileForm from './MentorProfileForm';
import RatingDisplay from '@/components/rating/RatingDisplay';
import styles from '@/styles/MentorDashboard.module.css';

export default function MentorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [annonce, setAnnonce] = useState<IAnnonce | null>(null);
  const [mentor, setMentor] = useState<IMentor | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isDeletingAnnonce, setIsDeletingAnnonce] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mentorRating, setMentorRating] = useState<IMentorRating | null>(null);

  const fetchMentorData = async () => {
    try {
      // Charger l'annonce du mentor
      const annonceResponse = await fetch(`/api/annonces/mentor/${session?.user?.id}`);
      if (annonceResponse.ok) {
        const annonceData = await annonceResponse.json();
        setAnnonce(annonceData.length > 0 ? annonceData[0] : null);
      }

      // Charger le profil mentor
      const mentorResponse = await fetch(`/api/mentors/${session?.user?.id}`);
      if (mentorResponse.ok) {
        const mentorData = await mentorResponse.json();
        setMentor(mentorData);
      } else {
        // Si le mentor n'existe pas, créer un profil par défaut
        setMentor({
          id: session?.user?.id || '',
          name: session?.user?.name || '',
          linkPhoto: session?.user?.image || '',
          email: session?.user?.email || '',
          role: 'mentor' as const,
          dateCreation: new Date(),
          nom: session?.user?.name || '',
          job: '',
          localisation: '',
          description: ''
        });
      }

      // Charger la note du mentor
      if (session?.user?.id) {
        const rating = await getMentorRating(session.user.id);
        setMentorRating(rating);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async (profileData: Partial<IMentor>) => {
    setIsUpdatingProfile(true);
    try {
      const response = await fetch(`/api/mentors/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      const updatedMentor = await response.json();
      setMentor(updatedMentor);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteAnnonce = async () => {
    if (!annonce?.id) return;
    
    setIsDeletingAnnonce(true);
    try {
      const response = await fetch(`/api/annonces/${annonce.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'annonce');
      }

      // Réinitialiser l'annonce et fermer la confirmation
      setAnnonce(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'annonce');
    } finally {
      setIsDeletingAnnonce(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      if (session.user.role !== 'mentor') {
        router.push('/dashboard');
        return;
      }
      fetchMentorData();
    }
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Chargement de votre espace mentor...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'mentor') {
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
      <main className={styles.main}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Espace Mentor</h1>
          <div className={styles.mentorBadge}>
            <span>🎯</span>
            <span>Mentor</span>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* Section Mon Profil */}
        <div className={styles.managementSection}>
          <div className={styles.managementCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Mon Profil</h3>
            </div>
            
            {isEditingProfile && mentor ? (
              <MentorProfileForm
                mentor={mentor}
                onSave={handleProfileSave}
                onCancel={() => setIsEditingProfile(false)}
                isLoading={isUpdatingProfile}
              />
            ) : mentor ? (
              <>
                <div className={styles.profileCard}>
                  <div className={styles.profileHeader}>
                    <Image
                      src={mentor.linkPhoto || '/placeholder_pp.png'}
                      alt="Photo du mentor"
                      width={60}
                      height={60}
                      className={styles.profileAvatar}
                    />
                    <div className={styles.profileInfo}>
                      <h3>{mentor.nom || 'Nom non renseigné'}</h3>
                      <p className={styles.job}>{mentor.job || 'Métier non renseigné'}</p>
                      <p className={styles.location}>📍 {mentor.localisation || 'Non renseignée'}</p>
                    </div>
                  </div>
                  <div className={styles.profileDescription}>
                    <p>{mentor.description || 'Description non renseignée'}</p>
                  </div>
                  <div className={styles.profileNote}>
                    <RatingDisplay 
                      averageRating={mentorRating?.averageRating || null}
                      totalRatings={mentorRating?.totalRatings || 0}
                      showText={true}
                      size="small"
                    />
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className={styles.primaryButton}
                  >
                    Modifier
                  </button>
                  <Link href={`/mentors/${session.user.id}`} className={styles.secondaryButton}>
                    Voir ma page
                  </Link>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>Erreur lors du chargement du profil</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Vue d'ensemble</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💼</div>
              <div className={styles.statNumber}>{annonce ? 1 : 0}</div>
              <div className={styles.statLabel}>Annonce active</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statNumber}>{mentorRating?.averageRating?.toFixed(1) || '--'}</div>
              <div className={styles.statLabel}>Note moyenne</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statNumber}>{mentorRating?.totalRatings || 0}</div>
              <div className={styles.statLabel}>Avis reçus</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statNumber}>{mentor?.job ? 1 : 0}</div>
              <div className={styles.statLabel}>Profil complet</div>
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className={styles.managementSection}>
          <h2 className={styles.sectionTitle}>Gestion</h2>
          
          {/* Section Mon Annonce */}
          <div className={styles.managementCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Mon Annonce</h3>
            </div>
            
            {annonce ? (
              <>
                <div className={styles.annonceCard}>
                  <div className={styles.annonceHeader}>
                    <h3>{annonce.nomMetier}</h3>
                    <span className={styles.etablissement}>{annonce.nomEtablissement}</span>
                  </div>
                  <p className={styles.type}>Type: {annonce.type}</p>
                  <p className={styles.location}>📍 {annonce.localisation}</p>
                  <div 
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(annonce.description) }}
                  />
                  
                  {annonce.ceQueJePropose && annonce.ceQueJePropose.trim() && (
                    <div className={styles.additionalSection}>
                      <h4>Ce que je propose</h4>
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(annonce.ceQueJePropose) }} />
                    </div>
                  )}

                  {annonce.profilRecherche && annonce.profilRecherche.trim() && (
                    <div className={styles.additionalSection}>
                      <h4>Profil recherché</h4>
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(annonce.profilRecherche) }} />
                    </div>
                  )}

                  {annonce.imageUrl && (
                    <div className={styles.imageContainer}>
                      <Image
                        src={annonce.imageUrl}
                        alt="Image de l'annonce"
                        width={200}
                        height={120}
                        className={styles.annonceImage}
                      />
                    </div>
                  )}
                  <div className={styles.annonceFooter}>
                    <span className={styles.date}>
                      Créée le {new Date(annonce.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => router.push(`/annonces/${annonce.id}/edit`)}
                    className={styles.primaryButton}
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className={styles.secondaryButton}
                    disabled={isDeletingAnnonce}
                  >
                    {isDeletingAnnonce ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.emptyState}>
                  <p>Vous n'avez pas encore créé votre annonce de mentorat.</p>
                  <p>Créez votre annonce pour commencer à recevoir des demandes.</p>
                </div>
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => router.push('/annonces/new')}
                    className={styles.primaryButton}
                  >
                    Créer mon annonce
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer votre annonce ? Cette action est irréversible.</p>
            <div className={styles.modalButtons}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
                disabled={isDeletingAnnonce}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAnnonce}
                className={styles.confirmDeleteButton}
                disabled={isDeletingAnnonce}
              >
                {isDeletingAnnonce ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}