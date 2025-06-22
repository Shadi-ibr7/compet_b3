'use client';

import { useState, useEffect } from 'react';
import type { Experience } from '@/types/common';
import styles from '@/styles/UserProfile.module.css';

interface ExperienceFormProps {
  experience?: Experience & { id?: string };
  onSave: (experienceData: Partial<Experience>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ExperienceForm({ experience, onSave, onCancel, isLoading = false }: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    type: experience?.type || 'pro' as 'pro' | 'education',
    institution: experience?.institution || '',
    position: experience?.position || '',
    startDate: experience?.startDate || '',
    endDate: experience?.endDate || '',
    isCurrentPosition: !experience?.endDate
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation des champs
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.institution.trim()) {
      newErrors.institution = formData.type === 'pro' ? 'L\'entreprise est requise' : 'L\'établissement est requis';
    }

    if (formData.type === 'pro' && !formData.position.trim()) {
      newErrors.position = 'Le poste est requis pour une expérience professionnelle';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (!formData.isCurrentPosition && !formData.endDate) {
      newErrors.endDate = 'La date de fin est requise si ce n\'est pas votre poste actuel';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const experienceData: Partial<Experience> = {
        type: formData.type,
        institution: formData.institution.trim(),
        startDate: formData.startDate,
        endDate: formData.isCurrentPosition ? undefined : formData.endDate
      };

      if (formData.type === 'pro') {
        experienceData.position = formData.position.trim();
      }

      await onSave(experienceData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      // Si on coche "poste actuel", vider la date de fin
      ...(field === 'isCurrentPosition' && value === true ? { endDate: '' } : {})
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className={styles.editForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Type d'expérience</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="type"
                value="pro"
                checked={formData.type === 'pro'}
                onChange={(e) => handleInputChange('type', e.target.value as 'pro' | 'education')}
                disabled={isLoading}
              />
              <span>Expérience professionnelle</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="type"
                value="education"
                checked={formData.type === 'education'}
                onChange={(e) => handleInputChange('type', e.target.value as 'pro' | 'education')}
                disabled={isLoading}
              />
              <span>Formation / Éducation</span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>
            {formData.type === 'pro' ? 'Entreprise' : 'Établissement / École'}
          </label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            className={`${styles.input} ${errors.institution ? styles.inputError : ''}`}
            placeholder={formData.type === 'pro' ? 'Ex: Google, Microsoft...' : 'Ex: Université de Paris, ESCP...'}
            disabled={isLoading}
          />
          {errors.institution && (
            <span className={styles.errorText}>{errors.institution}</span>
          )}
        </div>

        {formData.type === 'pro' && (
          <div className={styles.formGroup}>
            <label>Poste / Fonction</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className={`${styles.input} ${errors.position ? styles.inputError : ''}`}
              placeholder="Ex: Développeur Frontend, Consultant..."
              disabled={isLoading}
            />
            {errors.position && (
              <span className={styles.errorText}>{errors.position}</span>
            )}
          </div>
        )}

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Date de début</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={`${styles.input} ${errors.startDate ? styles.inputError : ''}`}
              max={getCurrentDate()}
              disabled={isLoading}
            />
            {errors.startDate && (
              <span className={styles.errorText}>{errors.startDate}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Date de fin</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={`${styles.input} ${errors.endDate ? styles.inputError : ''}`}
              max={getCurrentDate()}
              disabled={isLoading || formData.isCurrentPosition}
            />
            {errors.endDate && (
              <span className={styles.errorText}>{errors.endDate}</span>
            )}
          </div>
        </div>

        {formData.type === 'pro' && (
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isCurrentPosition}
                onChange={(e) => handleInputChange('isCurrentPosition', e.target.checked)}
                disabled={isLoading}
              />
              <span>Je travaille actuellement ici</span>
            </label>
          </div>
        )}

        <div className={styles.editActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isLoading}
          >
            {isLoading ? 'Sauvegarde...' : experience ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
}