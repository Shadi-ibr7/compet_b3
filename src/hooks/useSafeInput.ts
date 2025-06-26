// Custom hook for secure form input handling
import { useState, useCallback } from 'react';
import { sanitizeFormField, sanitizeTextMessage } from '@/lib/security';

export type FieldType = 
  | 'name' 
  | 'email' 
  | 'phone' 
  | 'city' 
  | 'address' 
  | 'url' 
  | 'job' 
  | 'description' 
  | 'motivation' 
  | 'company' 
  | 'title' 
  | 'location' 
  | 'password' 
  | 'text';

interface UseSafeInputOptions {
  fieldType: FieldType;
  preserveWhitespace?: boolean;
  initialValue?: string;
  maxLength?: number;
  required?: boolean;
}

interface UseSafeInputReturn {
  value: string;
  setValue: (value: string) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isValid: boolean;
  error: string | null;
  characterCount: number;
  maxLength: number;
}

/**
 * Custom hook for safe input handling with automatic sanitization
 */
export function useSafeInput(options: UseSafeInputOptions): UseSafeInputReturn {
  const {
    fieldType,
    preserveWhitespace = false,
    initialValue = '',
    maxLength: customMaxLength,
    required = false
  } = options;

  // Default max lengths by field type
  const defaultMaxLengths: Record<FieldType, number> = {
    name: 100,
    email: 150,
    phone: 20,
    city: 100,
    address: 200,
    url: 300,
    job: 100,
    description: 1000,
    motivation: 500,
    company: 100,
    title: 100,
    location: 100,
    password: 128,
    text: 200
  };

  const maxLength = customMaxLength || defaultMaxLengths[fieldType];
  
  const [value, setInternalValue] = useState<string>(
    sanitizeFormField(initialValue, fieldType)
  );
  const [error, setError] = useState<string | null>(null);

  const setValue = useCallback((newValue: string) => {
    let sanitized: string;

    // Use appropriate sanitization method
    if (fieldType === 'description' || fieldType === 'motivation') {
      sanitized = sanitizeTextMessage(newValue, preserveWhitespace);
    } else {
      sanitized = sanitizeFormField(newValue, fieldType);
    }

    // Enforce max length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.slice(0, maxLength);
    }

    // Validation
    let newError: string | null = null;
    
    if (required && !sanitized.trim()) {
      newError = 'Ce champ est requis';
    } else if (fieldType === 'email' && sanitized && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
      newError = 'Format d\'email invalide';
    } else if (fieldType === 'url' && sanitized && !/^https?:\/\/.+/.test(sanitized)) {
      newError = 'URL invalide (doit commencer par http:// ou https://)';
    } else if (fieldType === 'phone' && sanitized && !/^[\d\s\-\+\(\)\.]+$/.test(sanitized)) {
      newError = 'Numéro de téléphone invalide';
    }

    setInternalValue(sanitized);
    setError(newError);
  }, [fieldType, preserveWhitespace, maxLength, required]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.target.value);
  }, [setValue]);

  const isValid = !error && (!required || value.trim().length > 0);

  return {
    value,
    setValue,
    handleChange,
    isValid,
    error,
    characterCount: value.length,
    maxLength
  };
}