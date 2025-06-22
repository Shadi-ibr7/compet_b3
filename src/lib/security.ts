// Configuration de sécurité stricte
const SECURITY_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'u', 'strong', 'em', 'p', 'br', 
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'style']
};

// Fonction pour sanitiser côté serveur (sans DOMPurify)
function serverSanitize(html: string): string {
  if (!html) return '';
  
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
  const allowedTags = SECURITY_CONFIG.ALLOWED_TAGS.join('|');
  const tagRegex = new RegExp(`<(?!\/?(?:${allowedTags})(?:\s|>))[^>]*>`, 'gi');
  cleaned = cleaned.replace(tagRegex, '');
  
  return cleaned;
}

// Fonction pour sanitiser (utilise seulement la version serveur)
function clientSanitize(html: string): string {
  return serverSanitize(html);
}

/**
 * Nettoie et sécurise le contenu HTML
 * @param html - Le contenu HTML à nettoyer
 * @param maxLength - Longueur maximale autorisée (défaut: 5000)
 * @returns Le HTML nettoyé et sécurisé
 */
export function sanitizeHtml(html: string, maxLength: number = 5000): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Vérifier la longueur
  if (html.length > maxLength) {
    throw new Error(`Le contenu dépasse la limite de ${maxLength} caractères`);
  }

  // Détection de patterns suspects
  const suspiciousPatterns = [
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<script/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(html)) {
      console.warn('Tentative d\'injection détectée:', html.substring(0, 100));
      // En production, vous pourriez logger ceci avec l'ID utilisateur
    }
  }

  // Utiliser la sanitisation serveur (côté serveur Node.js)
  try {
    const cleanHtml = serverSanitize(html);
    
    // Vérification finale
    if (cleanHtml !== html) {
      console.warn('Contenu modifié par la sanitisation');
    }
    
    return cleanHtml;
  } catch (error) {
    console.error('Erreur lors de la sanitisation:', error);
    return '';
  }
}

/**
 * Version asynchrone pour le côté client
 * @param html - Le contenu HTML à nettoyer
 * @param maxLength - Longueur maximale autorisée (défaut: 5000)
 * @returns Le HTML nettoyé et sécurisé
 */
export async function sanitizeHtmlAsync(html: string, maxLength: number = 5000): Promise<string> {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Vérifier la longueur
  if (html.length > maxLength) {
    throw new Error(`Le contenu dépasse la limite de ${maxLength} caractères`);
  }

  try {
    const cleanHtml = await clientSanitize(html);
    return cleanHtml;
  } catch (error) {
    console.error('Erreur lors de la sanitisation:', error);
    return '';
  }
}

/**
 * Valide que le contenu est sûr avant l'envoi
 * @param content - Le contenu à valider
 * @returns true si le contenu est valide
 */
export function validateContent(content: string): boolean {
  if (!content || content.trim().length === 0) {
    return true; // Contenu vide accepté
  }

  // Vérifier la longueur
  if (content.length > 5000) {
    return false;
  }

  // Vérifier qu'il n'y a pas de scripts après sanitisation
  const sanitized = serverSanitize(content);
  const hasScript = /<script/gi.test(sanitized);
  
  return !hasScript;
}

/**
 * Convertit le markdown en HTML sécurisé
 * @param markdown - Le contenu markdown
 * @returns HTML sécurisé
 */
export function markdownToSafeHtml(markdown: string): string {
  if (!markdown) return '';
  
  // Conversion simple markdown vers HTML
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/__(.*)/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/_(.*)/gim, '<em>$1</em>')
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
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

  return serverSanitize(html);
}

/**
 * Extrait le texte brut d'un contenu HTML
 * @param html - Le contenu HTML
 * @returns Le texte brut
 */
export function extractPlainText(html: string): string {
  if (!html) return '';
  
  // Supprimer toutes les balises HTML
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}