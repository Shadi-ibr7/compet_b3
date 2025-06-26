'use client';
import React from 'react';
import { generateStars, formatRatingDisplay } from '@/lib/ratingService';
import styles from './RatingDisplay.module.css';

interface RatingDisplayProps {
  averageRating: number | null;
  totalRatings: number;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const RatingDisplay = ({ 
  averageRating, 
  totalRatings, 
  showText = true, 
  size = 'medium',
  className = ''
}: RatingDisplayProps) => {
  
  if (averageRating === null || totalRatings === 0) {
    return (
      <div className={`${styles.ratingContainer} ${styles[size]} ${className}`}>
        <div className={styles.newMentor}>
          <span className={styles.newMentorText}>Nouveau mentor</span>
        </div>
      </div>
    );
  }

  const stars = generateStars(averageRating);
  const displayText = formatRatingDisplay(averageRating, totalRatings);

  return (
    <div className={`${styles.ratingContainer} ${styles[size]} ${className}`}>
      <div className={styles.stars}>
        <span className={styles.fullStars}>{stars.fullStarText}</span>
        {stars.hasHalfStar && <span className={styles.halfStar}>{stars.halfStarText}</span>}
        {stars.emptyStars > 0 && <span className={styles.emptyStars}>{stars.emptyStarText}</span>}
      </div>
      {showText && (
        <span className={styles.ratingText}>
          {displayText}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;