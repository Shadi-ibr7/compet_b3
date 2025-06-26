'use client';
import React, { useState } from 'react';
import { createRating } from '@/lib/ratingService';
import styles from './RatingForm.module.css';

interface RatingFormProps {
  mentorId: string;
  mentorName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RatingForm = ({ mentorId, mentorName, onSuccess, onCancel }: RatingFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleStarHover = (value: number) => {
    setHoverRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    // Debug logging pour tracer les valeurs avant l'envoi
    console.log('[DEBUG] RatingForm handleSubmit avec:', {
      mentorId,
      mentorIdType: typeof mentorId,
      rating,
      ratingType: typeof rating,
      comment: comment.trim() || undefined
    });

    setIsSubmitting(true);
    setError(null);

    try {
      await createRating(mentorId, rating, comment.trim() || undefined);
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la soumission de la note:', error);
      setError((error as Error).message || 'Erreur lors de la soumission de la note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (value: number) => {
    switch (value) {
      case 1: return 'Très insatisfait';
      case 2: return 'Insatisfait';
      case 3: return 'Neutre';
      case 4: return 'Satisfait';
      case 5: return 'Très satisfait';
      default: return '';
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Noter {mentorName}</h3>
        <p className={styles.subtitle}>
          Partagez votre expérience pour aider les autres Molts
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.ratingSection}>
          <label className={styles.label}>Votre note *</label>
          <div className={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.star} ${
                  star <= displayRating ? styles.starActive : styles.starInactive
                }`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
          {displayRating > 0 && (
            <p className={styles.ratingText}>
              {getRatingText(displayRating)}
            </p>
          )}
        </div>

        <div className={styles.commentSection}>
          <label htmlFor="comment" className={styles.label}>
            Commentaire (optionnel)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec ce mentor..."
            className={styles.textarea}
            rows={4}
            maxLength={500}
          />
          <div className={styles.charCount}>
            {comment.length}/500
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Envoi...' : 'Publier la note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingForm;