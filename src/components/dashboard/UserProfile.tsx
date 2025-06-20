'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/UserProfile.module.css';

interface UserAdditionalInfo {
  address?: string;
  city?: string;
  role?: 'molt' | 'mentor';
  gender?: string;
  birthDate?: string;
  motivation?: string;
  skills?: string[];
  jobTitle?: string;
  cvUrl?: string;
}

interface EditableField {
  section: string;
  data: Partial<UserAdditionalInfo>;
}

export default function UserProfile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userAdditionalInfo, setUserAdditionalInfo] = useState<UserAdditionalInfo>({
    gender: 'Femme',
    birthDate: '01/01/1990',
    jobTitle: 'Développeur Full Stack',
    motivation: '',
    skills: ['Développement Web (React, Node.js)', 'Gestion de projet', 'Communication et leadership', 'Stratégie d\'entreprise'],
  });
  const [editableField, setEditableField] = useState<EditableField>({ section: '', data: {} });

  // Redirection si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Chargement des données utilisateur et informations supplémentaires
  useEffect(() => {
    if (session) {
      try {
        // Récupérer les informations supplémentaires du localStorage
        const storedInfo = localStorage.getItem('userAdditionalInfo');
        if (storedInfo) {
          const parsedInfo = JSON.parse(storedInfo);
          setUserAdditionalInfo(parsedInfo);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des informations utilisateur:', err);
        setError('Erreur lors du chargement des informations');
        setIsLoading(false);
      }
    }
  }, [session]);

  // Validation des données utilisateur
  const validateUserData = () => {
    if (!session?.user?.name || !session?.user?.email) {
      setError('Informations utilisateur incomplètes');
      return false;
    }
    return true;
  };

  // Gestion de la modification des informations
  const handleEdit = (section: string) => {
    if (!validateUserData()) return;
    setIsEditing(section);
    setError(null);
    
    // Préparer les données pour l'édition
    const editData: Partial<UserAdditionalInfo> = {};
    switch (section) {
      case 'profile':
        editData.jobTitle = userAdditionalInfo.jobTitle;
        editData.city = userAdditionalInfo.city;
        break;
      case 'information':
        editData.gender = userAdditionalInfo.gender;
        editData.birthDate = userAdditionalInfo.birthDate;
        break;
      case 'motivation':
        editData.motivation = userAdditionalInfo.motivation;
        break;
      case 'skills':
        editData.skills = userAdditionalInfo.skills;
        break;
    }
    setEditableField({ section, data: editData });
  };

  // Gestion de la sauvegarde
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour les informations locales
      const updatedInfo = { ...userAdditionalInfo, ...editableField.data };
      setUserAdditionalInfo(updatedInfo);
      localStorage.setItem('userAdditionalInfo', JSON.stringify(updatedInfo));
      
      setIsEditing(null);
      setEditableField({ section: '', data: {} });
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditableField({ section: '', data: {} });
    setError(null);
  };

  const handleFieldChange = (field: keyof UserAdditionalInfo, value: string | string[]) => {
    setEditableField(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const handleCvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Veuillez sélectionner un fichier PDF');
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du CV');
      }

      const { url } = await response.json();
      
      // Mettre à jour les informations locales
      const updatedInfo = { 
        ...userAdditionalInfo, 
        cvUrl: url 
      };
      setUserAdditionalInfo(updatedInfo);
      localStorage.setItem('userAdditionalInfo', JSON.stringify(updatedInfo));
      
      setCvFile(file);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      setError('Erreur lors du téléchargement du CV');
    } finally {
      setIsUploading(false);
    }
  };

  const renderEditForm = () => {
    if (!isEditing) return null;

    switch (isEditing) {
      case 'profile':
        return (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>Titre du poste</label>
              <input
                type="text"
                value={editableField.data.jobTitle || ''}
                onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Ville</label>
              <input
                type="text"
                value={editableField.data.city || ''}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        );

      case 'information':
        return (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>Genre</label>
              <select
                value={editableField.data.gender || ''}
                onChange={(e) => handleFieldChange('gender', e.target.value)}
                className={styles.input}
              >
                <option value="Femme">Femme</option>
                <option value="Homme">Homme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Date de naissance</label>
              <input
                type="date"
                value={editableField.data.birthDate || ''}
                onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        );

      case 'motivation':
        return (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>Ma motivation</label>
              <textarea
                value={editableField.data.motivation || ''}
                onChange={(e) => handleFieldChange('motivation', e.target.value)}
                className={styles.textarea}
                rows={4}
              />
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>Compétences (une par ligne)</label>
              <textarea
                value={editableField.data.skills?.join('\n') || ''}
                onChange={(e) => handleFieldChange('skills', e.target.value.split('\n'))}
                className={styles.textarea}
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // États de chargement
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

  if (!session) {
    return null;
  }

  // Déterminer le rôle affiché
  const displayRole = userAdditionalInfo.role || session.user.role || 'molt';
  const roleLabel = displayRole === 'mentor' ? 'Mentor' : 'Utilisateur Molty';

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
            <Image 
              src={session.user.image || '/placeholder_pp.png'} 
              width={80} 
              height={80} 
              alt="Photo de profil"
              className={styles.avatar}
            />
            <div className={styles.profileInfo}>
              <h2>{session.user.name}</h2>
              <p className={styles.jobTitle}>{roleLabel}</p>
              <div className={styles.location}>
                <Image 
                  src="/Union.svg" 
                  width={16} 
                  height={16} 
                  alt=""
                />
                <span>{userAdditionalInfo.city || 'Paris, France'}</span>
                <Image 
                  src="/linkedin.svg" 
                  width={20} 
                  height={20} 
                  alt=""
                  className={styles.linkedinIcon}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWithHighlight}>
              <h3>Informations</h3>
            </div>
            {isEditing === 'information' ? (
              <div className={styles.editActions}>
                <button onClick={handleSave} className={styles.saveButton} disabled={isLoading}>
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button onClick={handleCancel} className={styles.cancelButton} disabled={isLoading}>
                  Annuler
                </button>
              </div>
            ) : (
              <button 
                className={styles.modifyButton}
                onClick={() => handleEdit('information')}
                disabled={isLoading}
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
          
          {isEditing === 'information' ? (
            renderEditForm()
          ) : (
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <Image src="/mail.svg" width={20} height={20} alt="" />
                <span>{session.user.email}</span>
              </div>
              <div className={styles.infoItem}>
                <Image src="/gender.svg" width={20} height={20} alt="" />
                <span>{userAdditionalInfo.gender}</span>
              </div>
              <div className={styles.infoItem}>
                <Image src="/cake.svg" width={20} height={20} alt="" />
                <span>{userAdditionalInfo.birthDate}</span>
              </div>
              <div className={styles.infoItem}>
                <Image src="/molty_logo.svg" width={20} height={20} alt="" />
                <div>
                  <p>Membre du Molty Club</p>
                  <p>Depuis 2023</p>
                </div>
              </div>
              {userAdditionalInfo.address && (
                <div className={styles.infoItem}>
                  <Image src="/Union.svg" width={20} height={20} alt="" />
                  <span>{userAdditionalInfo.address}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Motivation Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWithHighlight}>
              <h3>Ma motivation</h3>
            </div>
            {isEditing === 'motivation' ? (
              <div className={styles.editActions}>
                <button onClick={handleSave} className={styles.saveButton} disabled={isLoading}>
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button onClick={handleCancel} className={styles.cancelButton} disabled={isLoading}>
                  Annuler
                </button>
              </div>
            ) : (
              <button 
                className={styles.modifyButton}
                onClick={() => handleEdit('motivation')}
                disabled={isLoading}
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
          
          {isEditing === 'motivation' ? (
            renderEditForm()
          ) : (
            <>
              <p className={styles.subtitle}>
                {displayRole === 'mentor' 
                  ? 'Pourquoi je veux devenir mentor ?' 
                  : 'Pourquoi je cherche un mentor ?'
                }
              </p>
              <p className={styles.content}>
                {displayRole === 'mentor' 
                  ? 'Je souhaite partager mon expérience et accompagner les jeunes talents dans leur parcours professionnel. Ayant moi-même bénéficié de mentors exceptionnels, je veux à mon tour contribuer à la réussite des autres.'
                  : 'Je souhaite être accompagné par un mentor expérimenté pour développer mes compétences et avancer dans ma carrière professionnelle.'
                }
              </p>
            </>
          )}
        </div>

        {/* Skills Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWithHighlight}>
              <h3>Mes compétences</h3>
            </div>
            {isEditing === 'skills' ? (
              <div className={styles.editActions}>
                <button onClick={handleSave} className={styles.saveButton} disabled={isLoading}>
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button onClick={handleCancel} className={styles.cancelButton} disabled={isLoading}>
                  Annuler
                </button>
              </div>
            ) : (
              <button 
                className={styles.modifyButton}
                onClick={() => handleEdit('skills')}
                disabled={isLoading}
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
          
          {isEditing === 'skills' ? (
            renderEditForm()
          ) : (
            <>
              <p className={styles.subtitle}>Domaines d'expertise</p>
              <ul className={styles.skillsList}>
                {userAdditionalInfo.skills?.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </>
          )}
          
          <label htmlFor="cv-upload" className={styles.uploadButton}>
            <input
              id="cv-upload"
              type="file"
              accept=".pdf"
              onChange={handleCvUpload}
              style={{ display: 'none' }}
            />
            <Image 
              src="/upload.svg" 
              width={24} 
              height={24} 
              alt=""
            />
            <div className={styles.uploadContent}>
              <span>{isUploading ? 'Téléchargement en cours...' : userAdditionalInfo.cvUrl ? 'Modifier le CV' : 'Ajouter un CV'}</span>
              {userAdditionalInfo.cvUrl && !isUploading && (
                <a 
                  href={userAdditionalInfo.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewCvLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  Voir le CV
                </a>
              )}
            </div>
          </label>
        </div>

        {/* Section spécifique au rôle */}
        {displayRole === 'mentor' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.titleWithHighlight}>
                <h3>Mon annonce</h3>
              </div>
              <button 
                className={styles.modifyButton}
                onClick={() => router.push('/dashboard')}
              >
                <Image 
                  src="/vector3.svg" 
                  width={16} 
                  height={16} 
                  alt="" 
                  className={styles.editIcon}
                />
                <span>Gérer</span>
              </button>
            </div>
            <p className={styles.subtitle}>Gérez votre annonce de mentorat</p>
            <p className={styles.content}>
              Créez et modifiez votre annonce pour attirer des élèves et partager votre expertise.
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 