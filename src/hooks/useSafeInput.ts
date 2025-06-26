import { useState, useCallback } from 'react';
import { sanitizeFormField, type FieldType } from '@/lib/security';

/**
 * Hook pour gérer la saisie sécurisée dans les formulaires
 * @param initialValue - Valeur initiale
 * @param fieldType - Type de champ pour la validation appropriée
 * @returns Objet avec value, setValue sécurisé, et error si applicable
 */
export function useSafeInput(initialValue: string = '', fieldType: FieldType = 'text') {
  const [value, setValue] = useState(sanitizeFormField(initialValue, fieldType));
  const [error, setError] = useState<string | null>(null);

  const safeSetValue = useCallback((newValue: string) => {
    try {
      const sanitized = sanitizeFormField(newValue, fieldType);
      setValue(sanitized);
      setError(null);
      
      // Log si le contenu a été modifié pour alerter l'utilisateur
      if (sanitized !== newValue && newValue.length > 0) {
        console.warn('⚠️ Contenu modifié par sécurité:', {
          original: newValue.substring(0, 50),
          sanitized: sanitized.substring(0, 50),
          fieldType
        });
      }
      
      return sanitized;
    } catch (err) {
      const errorMessage = `Erreur de validation pour le champ ${fieldType}`;
      setError(errorMessage);
      console.error('❌ Erreur useSafeInput:', err);
      return value; // Garder la valeur précédente en cas d'erreur
    }
  }, [fieldType, value]);

  // Fonction pour définir la valeur sans sanitisation (pour l'initialisation)
  const setInitialValue = useCallback((newValue: string) => {
    setValue(sanitizeFormField(newValue, fieldType));
    setError(null);
  }, [fieldType]);

  return {
    value,
    setValue: safeSetValue,
    setInitialValue,
    error,
    clearError: () => setError(null)
  };
}

/**
 * Hook spécialisé pour les arrays (comme les expériences)
 * @param initialArray - Array initial
 * @param itemFieldType - Type de champ pour les éléments de l'array
 * @returns Gestion sécurisée d'un array
 */
export function useSafeArray<T extends Record<string, unknown>>(
  initialArray: T[] = [], 
  sanitizeItem: (item: T) => T
) {
  const [items, setItems] = useState<T[]>(initialArray.map(sanitizeItem));

  const addItem = useCallback((item: T) => {
    const sanitizedItem = sanitizeItem(item);
    setItems(prev => [...prev, sanitizedItem]);
    return sanitizedItem;
  }, [sanitizeItem]);

  const updateItem = useCallback((index: number, item: T) => {
    const sanitizedItem = sanitizeItem(item);
    setItems(prev => prev.map((existingItem, i) => 
      i === index ? sanitizedItem : existingItem
    ));
    return sanitizedItem;
  }, [sanitizeItem]);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const setAllItems = useCallback((newItems: T[]) => {
    setItems(newItems.map(sanitizeItem));
  }, [sanitizeItem]);

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    setAllItems
  };
}