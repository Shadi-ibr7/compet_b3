import DOMPurify from 'dompurify';

// Configuration pour éviter les erreurs côté client
let isClient = false;
let purify: typeof DOMPurify | null = null;

// Initialiser DOMPurify côté client uniquement
if (typeof window !== 'undefined') {
  isClient = true;
  purify = DOMPurify;
}

// Configuration de sécurité stricte pour DOMPurify
const SECURITY_CONFIG_BASIC = {
  ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'p', 'br', 'ul', 'li'],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'style', 'class', 'id']
};

const SECURITY_CONFIG_FULL = {
  ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'p', 'br', 'ul', 'li', 'h2', 'h3', 'a'],
  ALLOWED_ATTR: ['href'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'h1', 'h4', 'h5', 'h6'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'style', 'class', 'id', 'target', 'rel']
};

// Configuration DOMPurify pour côté client
function configureDOMPurify(variant: 'basic' | 'full' = 'basic') {
  if (!isClient || !purify) {
    return; // Ne pas configurer côté serveur
  }

  const config = variant === 'full' ? SECURITY_CONFIG_FULL : SECURITY_CONFIG_BASIC;
  
  try {
    // Configurer DOMPurify avec nos règles strictes
    purify.setConfig({
      ALLOWED_TAGS: config.ALLOWED_TAGS,
      ALLOWED_ATTR: config.ALLOWED_ATTR,
      ALLOW_DATA_ATTR: config.ALLOW_DATA_ATTR,
      ALLOW_UNKNOWN_PROTOCOLS: config.ALLOW_UNKNOWN_PROTOCOLS,
      SANITIZE_DOM: config.SANITIZE_DOM,
      KEEP_CONTENT: config.KEEP_CONTENT,
      FORBID_TAGS: config.FORBID_TAGS,
      FORBID_ATTR: config.FORBID_ATTR
    });
    
    // Supprimer les hooks existants pour éviter les conflits
    purify.removeAllHooks();
    
    // Hooks pour sécurité renforcée avec vérification
    purify.addHook('beforeSanitizeAttributes', function (node) {
      // Vérifier que node est un élément DOM valide
      if (node && typeof node.hasAttributes === 'function' && node.hasAttributes()) {
        try {
          const attrs = Array.from(node.attributes || []);
          attrs.forEach(attr => {
            if (attr && attr.name && attr.value) {
              if (attr.name.toLowerCase().startsWith('on') || 
                  attr.value.toLowerCase().includes('javascript:') ||
                  attr.value.toLowerCase().includes('vbscript:')) {
                node.removeAttribute(attr.name);
              }
            }
          });
        } catch (error) {
          console.warn('Erreur lors du nettoyage des attributs:', error);
        }
      }
    });
    
    // Validation des liens pour variant full
    if (variant === 'full') {
      purify.addHook('afterSanitizeAttributes', function (node) {
        if (node && typeof node.hasAttribute === 'function' && 
            node.tagName === 'A' && node.hasAttribute('href')) {
          try {
            const href = node.getAttribute('href');
            if (href && !href.match(/^https?:\/\//)) {
              node.removeAttribute('href');
            }
          } catch (error) {
            console.warn('Erreur lors de la validation des liens:', error);
          }
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la configuration de DOMPurify:', error);
  }
}

// Fonction de sanitisation côté serveur (fallback)
function serverSanitize(html: string, variant: 'basic' | 'full' = 'basic'): string {
  if (!html) return '';
  
  const config = variant === 'full' ? SECURITY_CONFIG_FULL : SECURITY_CONFIG_BASIC;
  
  // Supprimer les balises dangereuses
  let cleaned = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
    .replace(/<form[^>]*>.*?<\/form>/gi, '')
    .replace(/<input[^>]*>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:(?!image)/gi, '');
  
  // Garder seulement les balises autorisées
  const allowedTags = config.ALLOWED_TAGS.join('|');
  const tagRegex = new RegExp(`<(?!\/?(?:${allowedTags})(?:\s|>))[^>]*>`, 'gi');
  cleaned = cleaned.replace(tagRegex, '');
  
  return cleaned;
}

/**
 * Nettoie et sécurise le contenu HTML avec DOMPurify
 * @param html - Le contenu HTML à nettoyer
 * @param variant - Type de configuration ('basic' pour annonces, 'full' pour articles)
 * @param maxLength - Longueur maximale autorisée (défaut: 5000)
 * @returns Le HTML nettoyé et sécurisé
 */
export function sanitizeHtml(html: string, variant: 'basic' | 'full' = 'basic', maxLength: number = 5000): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Vérifier la longueur
  if (html.length > maxLength) {
    throw new Error(`Le contenu dépasse la limite de ${maxLength} caractères`);
  }

  // Détection préventive de patterns suspects
  const suspiciousPatterns = [
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<script/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi
  ];

  let suspiciousContent = false;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(html)) {
      suspiciousContent = true;
      console.warn('🚨 Tentative d\'injection détectée:', {
        pattern: pattern.source,
        content: html.substring(0, 100),
        timestamp: new Date().toISOString()
      });
    }
  }

  try {
    // Utiliser la sanitisation appropriée selon l'environnement
    if (isClient && purify) {
      // Côté client avec DOMPurify
      configureDOMPurify(variant);
      const cleanHtml = purify.sanitize(html);
      
      // Vérification finale et logging
      if (cleanHtml !== html) {
        console.info('✅ Contenu sanitisé avec succès (client)', {
          originalLength: html.length,
          cleanedLength: cleanHtml.length,
          variant,
          suspicious: suspiciousContent
        });
      }
      
      return cleanHtml;
    } else {
      // Côté serveur avec sanitisation basique
      const cleanHtml = serverSanitize(html, variant);
      
      if (cleanHtml !== html) {
        console.info('✅ Contenu sanitisé avec succès (serveur)', {
          originalLength: html.length,
          cleanedLength: cleanHtml.length,
          variant,
          suspicious: suspiciousContent
        });
      }
      
      return cleanHtml;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la sanitisation:', error);
    // Utiliser la sanitisation de secours
    return serverSanitize(html, variant);
  }
}

/**
 * Version asynchrone pour le côté client (maintenant synchrone avec DOMPurify)
 * @param html - Le contenu HTML à nettoyer
 * @param variant - Type de configuration ('basic' pour annonces, 'full' pour articles)
 * @param maxLength - Longueur maximale autorisée (défaut: 5000)
 * @returns Le HTML nettoyé et sécurisé
 */
export async function sanitizeHtmlAsync(html: string, variant: 'basic' | 'full' = 'basic', maxLength: number = 5000): Promise<string> {
  // DOMPurify est synchrone, mais on garde l'interface async pour compatibilité
  return sanitizeHtml(html, variant, maxLength);
}

/**
 * Valide que le contenu est sûr avant l'envoi
 * @param content - Le contenu à valider
 * @param variant - Type de configuration pour la validation
 * @returns true si le contenu est valide
 */
export function validateContent(content: string, variant: 'basic' | 'full' = 'basic'): boolean {
  if (!content || content.trim().length === 0) {
    return true; // Contenu vide accepté
  }

  // Vérifier la longueur
  if (content.length > 5000) {
    return false;
  }

  try {
    // Vérifier qu'il n'y a pas de contenu malveillant après sanitisation
    const sanitized = sanitizeHtml(content, variant);
    
    // Si le contenu sanitisé est vide alors que l'original ne l'était pas,
    // cela indique un contenu potentiellement malveillant
    if (!sanitized && content.trim()) {
      return false;
    }
    
    // Vérifications supplémentaires
    const dangerousPatterns = [
      /<script/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(sanitized));
  } catch (error) {
    console.error('Erreur lors de la validation:', error);
    return false;
  }
}

/**
 * Convertit le markdown en HTML sécurisé
 * @param markdown - Le contenu markdown
 * @param variant - Type de configuration pour la sanitisation
 * @returns HTML sécurisé
 */
export function markdownToSafeHtml(markdown: string, variant: 'basic' | 'full' = 'basic'): string {
  if (!markdown) return '';
  
  // Conversion simple markdown vers HTML
  let html = markdown
    // Headers (seulement H2 et H3 pour variant full)
    .replace(/^### (.*$)/gim, variant === 'full' ? '<h3>$1</h3>' : '<strong>$1</strong>')
    .replace(/^## (.*$)/gim, variant === 'full' ? '<h2>$1</h2>' : '<strong>$1</strong>')
    .replace(/^# (.*$)/gim, '<strong>$1</strong>') // H1 jamais autorisé
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/__(.*?)__/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/_(.*?)_/gim, '<em>$1</em>')
    // Links (seulement pour variant full)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, 
      variant === 'full' ? '<a href="$2">$1</a>' : '$1')
    // Lists
    .replace(/^\* (.+$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.+$)/gim, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>');

  // Envelopper dans des paragraphes si nécessaire
  if (!html.includes('<p>') && !html.includes('<h')) {
    html = `<p>${html}</p>`;
  }

  // Traiter les listes
  html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');

  return sanitizeHtml(html, variant);
}

/**
 * Extrait le texte brut d'un contenu HTML de manière sécurisée
 * @param html - Le contenu HTML
 * @returns Le texte brut
 */
export function extractPlainText(html: string): string {
  if (!html) return '';
  
  // D'abord sanitiser le HTML pour sécurité
  const sanitized = sanitizeHtml(html, 'basic');
  
  // Supprimer toutes les balises HTML
  return sanitized
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

/**
 * Configuration des longueurs maximales par type de champ
 */
const FIELD_MAX_LENGTHS = {
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
  text: 200,
  default: 200
} as const;

/**
 * Types de champs supportés
 */
export type FieldType = 'name' | 'email' | 'phone' | 'city' | 'address' | 'url' | 'job' | 'description' | 'motivation' | 'company' | 'title' | 'location' | 'password' | 'text';

/**
 * Sanitise un champ de formulaire selon son type
 * @param value - Valeur à sanitiser
 * @param fieldType - Type de champ
 * @returns Valeur sanitisée
 */
export function sanitizeFormField(value: string, fieldType: FieldType = 'text'): string {
  if (!value || typeof value !== 'string') {
    return '';
  }

  const maxLength = FIELD_MAX_LENGTHS[fieldType] || FIELD_MAX_LENGTHS.default;
  
  // Validation spéciale selon le type
  if (fieldType === 'email') {
    // Validation email basique et sanitisation
    if (!value.includes('@') || value.length > maxLength) {
      return sanitizeTextMessage(value, maxLength);
    }
  } else if (fieldType === 'url') {
    // Validation URL et sanitisation
    if (value.startsWith('http') && !value.includes('javascript:') && !value.includes('vbscript:')) {
      return sanitizeTextMessage(value, maxLength);
    } else if (!value.startsWith('http')) {
      return sanitizeTextMessage(value, maxLength);
    } else {
      return ''; // URL suspecte
    }
  } else if (fieldType === 'phone') {
    // Conserver seulement chiffres, espaces, +, -, ()
    const phoneClean = value.replace(/[^0-9\s\+\-\(\)]/g, '');
    return sanitizeTextMessage(phoneClean, maxLength);
  } else if (fieldType === 'password') {
    // Pour les mots de passe : limiter seulement la longueur, pas de sanitisation agressive
    // Les caractères spéciaux peuvent être nécessaires pour la sécurité
    return value.length > maxLength ? value.substring(0, maxLength) : value;
  } else if (fieldType === 'description' || fieldType === 'motivation') {
    // Pour les descriptions et motivations : préserver les espaces en fin de ligne
    // Important pour l'UX dans les textareas
    return sanitizeTextMessage(value, maxLength, true); // preserveWhitespace = true
  }

  return sanitizeTextMessage(value, maxLength);
}

/**
 * Sanitise un objet de données de profil utilisateur
 * @param data - Données du profil
 * @returns Données sanitisées
 */
export function sanitizeProfile(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (typeof value === 'string') {
      // Détecter le type de champ selon la clé
      let fieldType: FieldType = 'text';
      
      if (key.toLowerCase().includes('email')) fieldType = 'email';
      else if (key.toLowerCase().includes('phone')) fieldType = 'phone';
      else if (key.toLowerCase().includes('city') || key.toLowerCase().includes('ville')) fieldType = 'city';
      else if (key.toLowerCase().includes('address') || key.toLowerCase().includes('adresse')) fieldType = 'address';
      else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('linkedin')) fieldType = 'url';
      else if (key.toLowerCase().includes('job') || key.toLowerCase().includes('metier')) fieldType = 'job';
      else if (key.toLowerCase().includes('description')) fieldType = 'description';
      else if (key.toLowerCase().includes('motivation')) fieldType = 'motivation';
      else if (key.toLowerCase().includes('company') || key.toLowerCase().includes('entreprise')) fieldType = 'company';
      else if (key.toLowerCase().includes('name') || key.toLowerCase().includes('nom')) fieldType = 'name';
      else if (key.toLowerCase().includes('title') || key.toLowerCase().includes('titre')) fieldType = 'title';
      else if (key.toLowerCase().includes('location') || key.toLowerCase().includes('localisation')) fieldType = 'location';

      sanitized[key] = sanitizeFormField(value, fieldType);
    } else if (Array.isArray(value)) {
      // Sanitiser les arrays (comme experiences)
      sanitized[key] = value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return sanitizeProfile(item as Record<string, unknown>);
        } else if (typeof item === 'string') {
          return sanitizeFormField(item, 'text');
        }
        return item;
      });
    } else if (typeof value === 'object' && value !== null) {
      // Sanitiser les objets imbriqués
      sanitized[key] = sanitizeProfile(value as Record<string, unknown>);
    } else {
      // Conserver les autres types (boolean, number, etc.)
      sanitized[key] = value;
    }
  });

  return sanitized;
}

/**
 * Sanitise un message de texte simple (pour les messages personnalisés)
 * @param message - Le message à sanitiser
 * @param maxLength - Longueur maximale (défaut: 500)
 * @param preserveWhitespace - Préserver les espaces en début/fin (défaut: false)
 * @returns Le message sanitisé
 */
export function sanitizeTextMessage(message: string, maxLength: number = 500, preserveWhitespace: boolean = false): string {
  if (!message || typeof message !== 'string') {
    return '';
  }

  // Vérifier la longueur
  if (message.length > maxLength) {
    throw new Error(`Le message dépasse la limite de ${maxLength} caractères`);
  }

  // Supprimer tout code HTML/JavaScript potentiel
  let cleaned = message
    .replace(/<[^>]*>/g, '') // Supprimer toutes les balises HTML
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/&lt;script/gi, '')
    .replace(/&lt;iframe/gi, '');

  // Appliquer trim seulement si on ne préserve pas les espaces
  if (!preserveWhitespace) {
    cleaned = cleaned.trim();
  }

  return cleaned;
}

/**
 * Sanitise le contenu HTML en préservant la structure et les espaces
 * Utilisé spécifiquement pour les éditeurs de contenu riche
 * @param html - Le contenu HTML
 * @param variant - Type de configuration
 * @returns Le HTML sanitisé avec espaces préservés
 */
export function sanitizeRichContent(html: string, variant: 'basic' | 'full' = 'basic'): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Utiliser sanitizeHtml qui préserve déjà la structure HTML
  // sans appliquer de trim agressif
  return sanitizeHtml(html, variant);
}