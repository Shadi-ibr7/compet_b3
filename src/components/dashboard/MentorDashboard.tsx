'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getMentorRating } from '@/lib/ratingService';
import { useSafeInput } from '@/hooks/useSafeInput';
import { sanitizeProfile } from '@/lib/security';
import type { IAnnonce } from '@/types/interfaces/annonce.interface';
import type { IMentor } from '@/types/interfaces/mentor.interface';
import type { IMentorRating } from '@/types/interfaces/rating.interface';
import MentorProfileForm from './MentorProfileForm';
import RatingDisplay from '@/components/rating/RatingDisplay';
import styles from '@/styles/AdminDashboard.module.css';

export default function MentorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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
    if (session?.user?.id) {
      fetchMentorData();
    }
  }, [session?.user?.id]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement de votre espace mentor...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'mentor') {
    return null;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Espace Mentor</h1>
          <div className={styles.userInfo}>
            <span>{session.user.name}</span>
            <Image
              src={session.user.image || '/placeholder_pp.png'}
              alt="Mentor avatar"
              width={40}
              height={40}
              className={styles.avatar}
            />
          </div>
        </div>
        <div className={styles.grid}>
          {/* Section Mon Annonce */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Mon Annonce</h2>
              {annonce ? (
                <div className={styles.buttonGroup}>
                  <button 
                    onClick={() => router.push(`/annonces/${annonce.id}/edit`)}
                    className={styles.modifyButton}
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className={styles.deleteButton}
                    disabled={isDeletingAnnonce}
                  >
                    {isDeletingAnnonce ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => router.push('/annonces/new')}
                  className={styles.addButton}
                >
                  Créer mon annonce
                </button>
              )}
            </div>
            
            {annonce ? (
              <div className={styles.annonceCard}>
                <div className={styles.annonceHeader}>
                  <h3>{annonce.nomMetier}</h3>
                  <span className={styles.etablissement}>{annonce.nomEtablissement}</span>
                </div>
                <p className={styles.type}>Type: {annonce.type}</p>
                <p className={styles.location}>📍 {annonce.localisation}</p>
                <p className={styles.description}>{annonce.description}</p>
                
                {/* Section Ce que je propose */}
                {annonce.ceQueJePropose && annonce.ceQueJePropose.trim() && (
                  <div className={styles.additionalSection}>
                    <h4>Ce que je propose</h4>
                    <p>{annonce.ceQueJePropose}</p>
                  </div>
                )}

                {/* Section Profil recherché */}
                {annonce.profilRecherche && annonce.profilRecherche.trim() && (
                  <div className={styles.additionalSection}>
                    <h4>Profil recherché</h4>
                    <p>{annonce.profilRecherche}</p>
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
            ) : (
              <div className={styles.emptyState}>
                <p>Vous n'avez pas encore créé votre annonce de mentorat.</p>
                <p>Créez votre annonce pour commencer à recevoir des demandes et partager votre expertise.</p>
              </div>
            )}
          </div>

          {/* Section Profil Mentor */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Mon Profil Mentor</h2>
              {!isEditingProfile && (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className={styles.modifyButton}
                >
                  Modifier
                </button>
              )}
            </div>
            
            {isEditingProfile && mentor ? (
              <MentorProfileForm
                mentor={mentor}
                onSave={handleProfileSave}
                onCancel={() => setIsEditingProfile(false)}
                isLoading={isUpdatingProfile}
              />
            ) : mentor ? (
              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <Image
                    src={mentor.linkPhoto || '/placeholder_pp.png'}
                    alt="Photo du mentor"
                    width={80}
                    height={80}
                    className={styles.profileAvatar}
                  />
                  <div className={styles.profileInfo}>
                    <h3>{mentor.nom || 'Nom non renseigné'}</h3>
                    <p className={styles.job}>{mentor.job || 'Métier non renseigné'}</p>
                    <p className={styles.location}>📍 {mentor.localisation || 'Localisation non renseignée'}</p>
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
            ) : (
              <div className={styles.emptyState}>
                <p>Erreur lors du chargement du profil</p>
              </div>
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