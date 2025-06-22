'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Experience } from '@/types/common';
import styles from '@/styles/UserProfile.module.css';

interface ExperienceCardProps {
  experience: Experience & { id?: string };
  onEdit: () => void;
  onDelete: (experienceId: string) => Promise<void>;
}

export default function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  const getDateRange = () => {
    const startDate = formatDate(experience.startDate);
    const endDate = experience.endDate ? formatDate(experience.endDate) : 'Présent';
    return `${startDate} - ${endDate}`;
  };

  const handleDelete = async () => {
    if (!experience.id) return;
    
    setIsDeleting(true);
    try {
      await onDelete(experience.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getExperienceIcon = () => {
    return experience.type === 'pro' ? '/briefcase.svg' : '/graduation-cap.svg';
  };

  const getExperienceTitle = () => {
    if (experience.type === 'pro') {
      return experience.position ? `${experience.position} chez ${experience.institution}` : experience.institution;
    }
    return experience.institution;
  };

  const getExperienceSubtitle = () => {
    if (experience.type === 'pro' && experience.position) {
      return experience.institution;
    }
    return experience.type === 'education' ? 'Formation' : 'Expérience professionnelle';
  };

  return (
    <>
      <div className={styles.experienceCard}>
        <div className={styles.experienceHeader}>
          <div className={styles.experienceIcon}>
            <Image 
              src={getExperienceIcon()} 
              width={24} 
              height={24} 
              alt={experience.type === 'pro' ? 'Expérience pro' : 'Formation'} 
            />
          </div>
          <div className={styles.experienceContent}>
            <h4 className={styles.experienceTitle}>
              {getExperienceTitle()}
            </h4>
            <p className={styles.experienceSubtitle}>
              {getExperienceSubtitle()}
            </p>
            <p className={styles.experienceDate}>
              {getDateRange()}
            </p>
          </div>
          <div className={styles.experienceActions}>
            <button 
              onClick={onEdit}
              className={styles.experienceEditButton}
              title="Modifier l'expérience"
            >
              <Image 
                src="/vector3.svg" 
                width={14} 
                height={14} 
                alt="" 
              />
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className={styles.experienceDeleteButton}
              disabled={isDeleting}
              title="Supprimer l'expérience"
            >
              <Image 
                src="/trash.svg" 
                width={14} 
                height={14} 
                alt="" 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirmer la suppression</h3>
            <p>
              Êtes-vous sûr de vouloir supprimer cette expérience ?
            </p>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
              Cette action est irréversible.
            </p>
            <div className={styles.modalButtons}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className={styles.confirmDeleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}