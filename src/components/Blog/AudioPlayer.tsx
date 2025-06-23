'use client';
import React from 'react';
import styles from './BlogPage.module.css';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  return (
    <div className={styles.simpleAudioPlayer}>
      <audio 
        controls 
        className={styles.audioControls}
        preload="metadata"
      >
        <source src={src} type="audio/mpeg" />
        Votre navigateur ne supporte pas la lecture audio.
      </audio>
    </div>
  );
}