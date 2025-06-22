'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from '@/styles/UserProfile.module.css';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoSelect: (file: File) => void;
  onPhotoRemove?: () => void;
  isUploading?: boolean;
  className?: string;
  size?: number;
}

export default function PhotoUpload({ 
  currentPhotoUrl, 
  onPhotoSelect, 
  onPhotoRemove,
  isUploading = false,
  className = '',
  size = 80
}: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation du fichier
  const validateFile = (file: File): boolean => {
    setError(null);

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format non supporté. Utilisez JPG, PNG ou WebP.');
      return false;
    }

    // Vérifier la taille (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError('La photo doit faire moins de 2MB.');
      return false;
    }

    return true;
  };

  // Gestion de la sélection de fichier
  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      onPhotoSelect(file);
    }
  }, [onPhotoSelect]);

  // Gestion du clic sur l'input
  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  // Gestion du changement d'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Gestion du drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`${styles.photoUploadSection} ${className}`}>
      {/* Avatar avec overlay pour modification */}
      <div className={styles.photoUploadContainer}>
        <Image 
          src={currentPhotoUrl || '/placeholder_pp.png'} 
          width={size} 
          height={size} 
          alt="Photo de profil"
          className={styles.avatar}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
        
        {!isUploading && (
          <div className={styles.photoUploadOverlay} onClick={handleClick}>
            <span className={styles.photoUploadIcon}>📷</span>
          </div>
        )}
        
        {isUploading && (
          <div className={styles.photoUploadOverlay}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleInputChange}
          className={styles.photoUploadButton}
          disabled={isUploading}
        />
      </div>

      {/* Zone de drop alternative */}
      <div 
        className={`${styles.photoUploadZone} ${dragActive ? styles.dragActive : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ marginTop: '12px' }}
      >
        <div className={styles.photoUploadContent}>
          <Image 
            src="/upload.svg" 
            width={24} 
            height={24} 
            alt=""
            style={{ opacity: 0.5 }}
          />
          <p className={styles.photoUploadText}>
            {isUploading ? 'Upload en cours...' : 'Cliquez ou glissez une photo'}
          </p>
          <p className={styles.photoUploadSubtext}>
            JPG, PNG, WebP - Max 2MB
          </p>
        </div>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className={styles.error} style={{ marginTop: '8px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Bouton de suppression */}
      {currentPhotoUrl && currentPhotoUrl !== '/placeholder_pp.png' && onPhotoRemove && !isUploading && (
        <button 
          onClick={onPhotoRemove}
          className={styles.cancelButton}
          style={{ marginTop: '8px', fontSize: '12px', padding: '4px 8px' }}
        >
          Supprimer la photo
        </button>
      )}
    </div>
  );
}