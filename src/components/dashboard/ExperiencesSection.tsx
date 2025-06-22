'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Experience } from '@/types/common';
import ExperienceCard from './ExperienceCard';
import ExperienceForm from './ExperienceForm';
import styles from '@/styles/UserProfile.module.css';

interface ExperiencesSectionProps {
  moltId: string;
  experiences: Experience[];
  onExperiencesUpdate: (experiences: Experience[]) => void;
}

export default function ExperiencesSection({ 
  moltId, 
  experiences, 
  onExperiencesUpdate 
}: ExperiencesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingExperience, setEditingExperience] = useState<(Experience & { id?: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddExperience = async (experienceData: Partial<Experience>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/molts/${moltId}/experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'expérience');
      }

      const newExperience = await response.json();
      const updatedExperiences = [...experiences, newExperience];
      onExperiencesUpdate(updatedExperiences);
      setIsAdding(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de l\'ajout de l\'expérience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExperience = async (experienceData: Partial<Experience>) => {
    if (!editingExperience?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/molts/${moltId}/experiences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingExperience.id,
          ...experienceData
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de l\'expérience');
      }

      const updatedExperience = await response.json();
      const updatedExperiences = experiences.map(exp => 
        (exp as Experience & { id?: string }).id === editingExperience.id 
          ? updatedExperience 
          : exp
      );
      onExperiencesUpdate(updatedExperiences);
      setEditingExperience(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la modification de l\'expérience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExperience = async (experienceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/molts/${moltId}/experiences`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: experienceId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'expérience');
      }

      const updatedExperiences = experiences.filter(exp => 
        (exp as Experience & { id?: string }).id !== experienceId
      );
      onExperiencesUpdate(updatedExperiences);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la suppression de l\'expérience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingExperience(null);
    setError(null);
  };

  const handleStartEdit = (experience: Experience & { id?: string }) => {
    setEditingExperience(experience);
    setIsAdding(false);
    setError(null);
  };

  // Tri des expériences par date de début (plus récent en premier)
  const sortedExperiences = [...experiences].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleWithHighlight}>
          <h3>Expériences</h3>
        </div>
        {!isAdding && !editingExperience && (
          <button 
            className={styles.modifyButton}
            onClick={() => setIsAdding(true)}
            disabled={isLoading}
          >
            <Image 
              src="/plus.svg" 
              width={16} 
              height={16} 
              alt="" 
              className={styles.editIcon}
            />
            <span>Ajouter</span>
          </button>
        )}
      </div>

      <p className={styles.subtitle}>
        Vos expériences professionnelles et formations
      </p>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {/* Formulaire d'ajout */}
      {isAdding && (
        <ExperienceForm
          onSave={handleAddExperience}
          onCancel={handleCancelAdd}
          isLoading={isLoading}
        />
      )}

      {/* Liste des expériences */}
      <div className={styles.experiencesList}>
        {sortedExperiences.map((experience, index) => {
          const experienceWithId = experience as Experience & { id?: string };
          
          return (
            <div key={experienceWithId.id || index}>
              <ExperienceCard
                experience={experienceWithId}
                onEdit={() => handleStartEdit(experienceWithId)}
                onDelete={handleDeleteExperience}
              />
              
              {/* Formulaire d'édition */}
              {editingExperience?.id === experienceWithId.id && editingExperience && (
                <ExperienceForm
                  experience={editingExperience}
                  onSave={handleEditExperience}
                  onCancel={handleCancelEdit}
                  isLoading={isLoading}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* État vide */}
      {sortedExperiences.length === 0 && !isAdding && (
        <div className={styles.emptyExperiences}>
          <Image 
            src="/briefcase.svg" 
            width={48} 
            height={48} 
            alt="" 
            style={{ opacity: 0.3, marginBottom: '12px' }}
          />
          <p><strong>Aucune expérience ajoutée</strong></p>
          <p>Ajoutez vos expériences professionnelles et formations pour enrichir votre profil.</p>
          <button 
            className={styles.addExperienceButton}
            onClick={() => setIsAdding(true)}
            disabled={isLoading}
          >
            <Image 
              src="/plus.svg" 
              width={20} 
              height={20} 
              alt="" 
            />
            <span>Ajouter votre première expérience</span>
          </button>
        </div>
      )}
    </div>
  );
}