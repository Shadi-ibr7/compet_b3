// Security utilities for XSS protection and content sanitization
import DOMPurify from 'isomorphic-dompurify';

// Configuration pour DOMPurify selon le type de contenu
const BASIC_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  REMOVE_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  REMOVE_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur']
};

const FULL_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  KEEP_CONTENT: true,
  REMOVE_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  REMOVE_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur']
};

/**
 * Sanitize HTML content using DOMPurify
 */
export function sanitizeHtml(content: string, variant: 'basic' | 'full' = 'basic'): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  const config = variant === 'full' ? FULL_CONFIG : BASIC_CONFIG;
  
  try {
    const cleaned = DOMPurify.sanitize(content, config);
    
    // Log potential security threats
    if (cleaned !== content) {
      console.warn('[SECURITY] HTML content was sanitized:', {
        original: content.slice(0, 100) + '...',
        cleaned: cleaned.slice(0, 100) + '...',
        variant
      });
    }
    
    return cleaned;
  } catch (error) {
    console.error('[SECURITY] Error sanitizing HTML:', error);
    return '';
  }
}

/**
 * Sanitize form field input based on field type
 */
export function sanitizeFormField(value: string, fieldType: string): string {
  if (!value || typeof value !== 'string') {
    return '';
  }

  // Character limits by field type
  const limits: { [key: string]: number } = {
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

  const maxLength = limits[fieldType] || 200;
  let sanitized = value.trim().slice(0, maxLength);

  // Remove dangerous patterns
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
}

/**
 * Sanitize text messages with optional whitespace preservation
 */
export function sanitizeTextMessage(content: string, preserveWhitespace: boolean = false): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let sanitized = content;

  // Remove HTML tags and dangerous content
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  if (!preserveWhitespace) {
    sanitized = sanitized.trim().replace(/\s+/g, ' ');
  }

  return sanitized;
}

/**
 * Sanitize rich content for text editors
 */
export function sanitizeRichContent(content: string): string {
  return sanitizeHtml(content, 'full');
}

/**
 * Validate content for malicious patterns
 */
export function validateContent(content: string): { isValid: boolean; threats: string[] } {
  const threats: string[] = [];
  
  if (!content || typeof content !== 'string') {
    return { isValid: true, threats: [] };
  }

  // Check for common XSS patterns
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi
  ];

  xssPatterns.forEach((pattern, index) => {
    if (pattern.test(content)) {
      threats.push(`XSS_PATTERN_${index + 1}`);
    }
  });

  return {
    isValid: threats.length === 0,
    threats
  };
}

/**
 * Convert markdown-like text to safe HTML
 */
export function markdownToSafeHtml(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let html = text;
  
  // Convert basic markdown to HTML
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  html = `<p>${html}</p>`;

  // Sanitize the result
  return sanitizeHtml(html, 'full');
}

/**
 * Safe profile sanitization for user data
 */
export function sanitizeProfile(profileData: Record<string, unknown>): Record<string, unknown> {
  if (!profileData || typeof profileData !== 'object') {
    return {};
  }

  const sanitized: Record<string, unknown> = {};

  // Sanitize each field based on its type
  for (const [key, value] of Object.entries(profileData)) {
    if (typeof value === 'string') {
      switch (key) {
        case 'description':
        case 'motivation':
          sanitized[key] = sanitizeTextMessage(value, true);
          break;
        case 'email':
          sanitized[key] = sanitizeFormField(value, 'email');
          break;
        case 'name':
        case 'nom':
          sanitized[key] = sanitizeFormField(value, 'name');
          break;
        case 'job':
          sanitized[key] = sanitizeFormField(value, 'job');
          break;
        case 'localisation':
        case 'location':
          sanitized[key] = sanitizeFormField(value, 'location');
          break;
        case 'linkPhoto':
        case 'imageUrl':
          sanitized[key] = sanitizeFormField(value, 'url');
          break;
        default:
          sanitized[key] = sanitizeFormField(value, 'text');
      }
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}