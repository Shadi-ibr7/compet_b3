"use client";

import { useMemo } from 'react';
import { sanitizeHtml } from '@/lib/security';

interface SafeHtmlProps {
  html: string;
  variant?: 'basic' | 'full';
  className?: string;
  maxLength?: number;
}

/**
 * Composant pour afficher du HTML sanitisé de manière sécurisée
 */
export default function SafeHtml({ 
  html, 
  variant = 'basic', 
  className = '',
  maxLength = 5000 
}: SafeHtmlProps) {
  const sanitizedHtml = useMemo(() => {
    if (!html) return '';
    
    try {
      return sanitizeHtml(html, variant, maxLength);
    } catch (error) {
      console.error('Erreur lors de la sanitisation pour affichage:', error);
      return ''; // Retourner contenu vide en cas d'erreur
    }
  }, [html, variant, maxLength]);

  // Si le contenu est vide après sanitisation, ne rien afficher
  if (!sanitizedHtml) {
    return null;
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}