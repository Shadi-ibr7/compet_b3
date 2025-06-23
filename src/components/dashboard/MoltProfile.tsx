'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { IMolt } from '@/types/interfaces/molt.interface';
import type { Experience } from '@/types/common';
import ExperiencesSection from './ExperiencesSection';
import PhotoUpload from './PhotoUpload';
import styles from '@/styles/UserProfile.module.css';

export default function MoltProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [moltProfile, setMoltProfile] = useState<IMolt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  // Form state pour l'édition du profil
  const [editForm, setEditForm] = useState({
    name: '',
    linkedin: '',
    city: '',
    jobTitle: '',
    motivation: '',
    linkPhoto: ''
  });

  // Redirection si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Chargement du profil Molt
  const fetchMoltProfile = async () => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/molts/${session.user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setMoltProfile(data);
        setEditForm({
          name: data.name || '',
          linkedin: data.linkedin || '',
          city: data.city || '',
          jobTitle: data.jobTitle || '',
          motivation: data.motivation || '',
          linkPhoto: data.linkPhoto || ''
        });
      } else if (response.status === 404) {
        // Profil Molt n'existe pas encore, créer un profil par défaut
        const defaultProfile: IMolt = {
          id: session.user.id,
          name: session.user.name || '',
          linkPhoto: session.user.image || '',
          email: session.user.email || '',
          role: 'molt',
          dateCreation: new Date(),
          paid: false,
          linkedin: '',
          experiences: []
        };
        setMoltProfile(defaultProfile);
        setEditForm({
          name: session.user.name || '',
          linkedin: '',
          city: '',
          jobTitle: '',
          motivation: '',
          linkPhoto: ''
        });
      } else {
        throw new Error('Erreur lors du chargement du profil');
      }
    } catch (err) {
      console.error('Erreur lors du chargement du profil Molt:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarde du profil
  const handleProfileSave = async () => {
    if (!session?.user?.id || !moltProfile) return;

    setIsUpdatingProfile(true);
    try {
      let updateData = { ...editForm };

      // Upload de la photo si une nouvelle photo a été sélectionnée
      if (selectedPhotoFile) {
        const photoUrl = await handlePhotoUpload();
        if (photoUrl) {
          updateData = { ...updateData, linkPhoto: photoUrl };
        } else {
          // Si l'upload a échoué, ne pas continuer
          return;
        }
      }

      const response = await fetch(`/api/molts/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      const updatedProfile = await response.json();
      setMoltProfile(updatedProfile);
      setIsEditingProfile(false);
      
      // Nettoyer les états de photo
      handlePhotoRemove();
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la sauvegarde du profil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    if (moltProfile) {
      setEditForm({
        name: moltProfile.name || '',
        linkedin: moltProfile.linkedin || '',
        city: moltProfile.city || '',
        jobTitle: moltProfile.jobTitle || '',
        motivation: moltProfile.motivation || '',
        linkPhoto: moltProfile.linkPhoto || ''
      });
    }
    // Nettoyer les états de photo
    handlePhotoRemove();
    setError(null);
  };

  const validateLinkedInUrl = (url: string) => {
    if (!url) return true; // Optionnel
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinRegex.test(url);
  };

  const handleFormChange = (field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    if (field === 'linkedin' && value && !validateLinkedInUrl(value)) {
      setError('Format d\'URL LinkedIn invalide. Exemple: https://linkedin.com/in/votre-profil');
    } else {
      setError(null);
    }
  };

  // Fonction utilitaire pour formater la date de création
  const formatCreationDate = (dateCreation: Date | string | number | { seconds: number } | null | undefined): string => {
    try {
      // Cas 1: Date JavaScript native
      if (dateCreation instanceof Date) {
        return dateCreation.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      }

      // Cas 2: Timestamp Firestore (objet avec seconds/nanoseconds)
      if (dateCreation && typeof dateCreation === 'object' && 'seconds' in dateCreation) {
        const date = new Date((dateCreation as { seconds: number }).seconds * 1000);
        return date.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      }

      // Cas 3: Chaîne de caractères (ISO, etc.)
      if (typeof dateCreation === 'string' && dateCreation.trim()) {
        const date = new Date(dateCreation);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
        }
      }

      // Cas 4: Nombre (timestamp en millisecondes)
      if (typeof dateCreation === 'number' && dateCreation > 0) {
        const date = new Date(dateCreation);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
        }
      }

      // Fallback
      return 'Date d\'inscription non disponible';
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return 'Date d\'inscription non disponible';
    }
  };

  // Gestion de l'upload de photo
  const handlePhotoSelect = async (file: File) => {
    setSelectedPhotoFile(file);
    
    // Créer une URL de prévisualisation
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl(previewUrl);
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhotoFile || !session?.user?.id) return null;

    setIsUploadingPhoto(true);
    try {
      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('file', selectedPhotoFile);
      formData.append('type', 'profile');

      // Upload vers l'API existante
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Erreur lors de l\'upload de la photo');
      }

      const uploadResult = await uploadResponse.json();
      return uploadResult.url;
    } catch (error) {
      console.error('Erreur upload photo:', error);
      setError('Erreur lors de l\'upload de la photo');
      return null;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePhotoRemove = () => {
    setSelectedPhotoFile(null);
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(null);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchMoltProfile();
    }
  }, [session?.user?.id]);

  if (status === "loading" || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Chargement de votre profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'molt') {
    return null;
  }

  if (!moltProfile) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.error}>
            Erreur lors du chargement du profil
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Mon Compte</h1>
          <Image 
            src="/material_symbols_settings.svg" 
            width={24} 
            height={24} 
            alt=""
            className={styles.settingsIcon}
          />
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* Profile Section */}
        <div className={styles.section}>
          <div className={styles.profileCard}>
            {isEditingProfile ? (
              <PhotoUpload 
                currentPhotoUrl={photoPreviewUrl || moltProfile.linkPhoto || session.user.image || '/placeholder_pp.png'}
                onPhotoSelect={handlePhotoSelect}
                onPhotoRemove={selectedPhotoFile ? handlePhotoRemove : undefined}
                isUploading={isUploadingPhoto}
                size={80}
              />
            ) : (
              <Image 
                src={moltProfile.linkPhoto || session.user.image || '/placeholder_pp.png'} 
                width={80} 
                height={80} 
                alt="Photo de profil"
                className={styles.avatar}
              />
            )}
            <div className={styles.profileInfo}>
              <h2>{editForm.name || session.user.name}</h2>
              <p className={styles.jobTitle}>
                {moltProfile.paid ? '✅ Membre Molty Premium' : '⏳ Membre Molty (Gratuit)'}
              </p>
              <div className={styles.location}>
                <Image 
                  src="/Union.svg" 
                  width={16} 
                  height={16} 
                  alt=""
                />
                <span>{editForm.city || 'Ville non renseignée'}</span>
                {moltProfile.linkedin && (
                  <a 
                    href={moltProfile.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.linkedinIcon}
                  >
                    <Image 
                      src="/linkedin.svg" 
                      width={20} 
                      height={20} 
                      alt="LinkedIn"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          {isEditingProfile && (
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label>Nom complet</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className={styles.input}
                  placeholder="Ex: Marie Dupont"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Titre/Poste actuel</label>
                <input
                  type="text"
                  value={editForm.jobTitle}
                  onChange={(e) => handleFormChange('jobTitle', e.target.value)}
                  className={styles.input}
                  placeholder="Ex: Étudiant en informatique, Développeur Junior..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ville</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => handleFormChange('city', e.target.value)}
                  className={styles.input}
                  placeholder="Ex: Paris, Lyon, Marseille..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Profil LinkedIn (optionnel)</label>
                <input
                  type="url"
                  value={editForm.linkedin}
                  onChange={(e) => handleFormChange('linkedin', e.target.value)}
                  className={styles.input}
                  placeholder="https://linkedin.com/in/votre-profil"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Motivation pour trouver un mentor</label>
                <textarea
                  value={editForm.motivation}
                  onChange={(e) => handleFormChange('motivation', e.target.value)}
                  className={styles.textarea}
                  rows={4}
                  placeholder="Décrivez vos objectifs, ce que vous recherchez chez un mentor..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Premium Upgrade Section */}
        {!moltProfile.paid && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.titleWithHighlight}>
                <h3>Passer à Premium</h3>
              </div>
            </div>
            
            <div className={styles.premiumCard}>
              <div className={styles.premiumContent}>
                <div className={styles.premiumIcon}>⭐</div>
                <div className={styles.premiumText}>
                  <h4>Débloquez toutes les fonctionnalités Molty</h4>
                  <p>Accédez à tous les mentors, messages illimités et bien plus encore.</p>
                </div>
              </div>
              <button 
                className={styles.upgradeButton}
                onClick={() => router.push('/payment')}
              >
                Passer à Premium
              </button>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWithHighlight}>
              <h3>Informations</h3>
            </div>
            {isEditingProfile ? (
              <div className={styles.editActions}>
                <button 
                  onClick={handleProfileSave} 
                  className={styles.saveButton} 
                  disabled={isUpdatingProfile || (!!editForm.linkedin && !validateLinkedInUrl(editForm.linkedin))}
                >
                  {isUpdatingProfile ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button 
                  onClick={handleProfileCancel} 
                  className={styles.cancelButton} 
                  disabled={isUpdatingProfile}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button 
                className={styles.modifyButton}
                onClick={() => setIsEditingProfile(true)}
                disabled={isUpdatingProfile}
              >
                <Image 
                  src="/vector3.svg" 
                  width={16} 
                  height={16} 
                  alt="" 
                  className={styles.editIcon}
                />
                <span>Modifier</span>
              </button>
            )}
          </div>
          
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <Image src="/mail.svg" width={20} height={20} alt="" />
              <span>{session.user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <Image src="/molty_logo.svg" width={20} height={20} alt="" />
              <div>
                <p>Membre du Molty Club</p>
                <p>Status: {moltProfile.paid ? 'Premium' : 'Gratuit'}</p>
              </div>
            </div>
            {editForm.jobTitle && (
              <div className={styles.infoItem}>
                <Image src="/briefcase.svg" width={20} height={20} alt="" />
                <span>{editForm.jobTitle}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <Image src="/linkedin.svg" width={20} height={20} alt="" />
              {editForm.linkedin ? (
                <a 
                  href={editForm.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.linkedinLink}
                >
                  Voir mon profil LinkedIn
                </a>
              ) : (
                <span className={styles.linkedinEmpty}>
                  Profil LinkedIn non renseigné
                </span>
              )}
            </div>
            <div className={styles.infoItem}>
              <Image src="/cake.svg" width={20} height={20} alt="" />
              <span>Membre depuis le {formatCreationDate(moltProfile.dateCreation)}</span>
            </div>
          </div>
        </div>

        {/* Motivation Section */}
        {editForm.motivation && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.titleWithHighlight}>
                <h3>Ma motivation</h3>
              </div>
            </div>
            <p className={styles.subtitle}>
              Pourquoi je cherche un mentor ?
            </p>
            <p className={styles.content}>
              {editForm.motivation}
            </p>
          </div>
        )}

        {/* Experiences Section */}
        <ExperiencesSection 
          moltId={moltProfile.id || session.user.id} 
          experiences={moltProfile.experiences || []}
          onExperiencesUpdate={(newExperiences) => {
            setMoltProfile(prev => prev ? { ...prev, experiences: newExperiences } : null);
          }}
        />
      </main>
    </div>
  );
}