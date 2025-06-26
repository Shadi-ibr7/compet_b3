import { NextRequest, NextResponse } from 'next/server';
import { sanitizeHtml, validateContent, sanitizeTextMessage, sanitizeFormField } from '@/lib/security';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/credentials-config';

// Rate limiting simple en mémoire (en production, utilisez Redis)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 50; // 50 requêtes par minute

/**
 * Rate limiting middleware
 */
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return true;
  }

  // Reset si la fenêtre est expirée
  if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return true;
  }

  // Incrémenter le compteur
  userLimit.count++;

  // Vérifier la limite
  if (userLimit.count > RATE_LIMIT_MAX_REQUESTS) {
    console.warn(`🚨 Rate limit dépassé pour ${identifier}:`, {
      count: userLimit.count,
      timestamp: new Date().toISOString()
    });
    return false;
  }

  return true;
}

/**
 * Sanitise le body d'une requête contenant du HTML
 */
function sanitizeRequestBody(body: Record<string, unknown>, variant: 'basic' | 'full' = 'basic'): Record<string, unknown> {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitizedBody = { ...body };

  // Champs à sanitiser selon le type de contenu
  const htmlFields = ['description', 'content', 'ceQueJePropose', 'profilRecherche'];
  const textFields = ['customMessage', 'title', 'auteur', 'nomEtablissement', 'nomMetier', 'localisation', 'name', 'nom', 'job', 'city', 'jobTitle', 'motivation', 'linkedinUrl', 'phone', 'address'];

  // Sanitiser les champs HTML
  htmlFields.forEach(field => {
    if (sanitizedBody[field] && typeof sanitizedBody[field] === 'string') {
      try {
        const fieldValue = sanitizedBody[field] as string;
        sanitizedBody[field] = sanitizeHtml(fieldValue, variant);
        
        // Valider le contenu
        if (!validateContent(sanitizedBody[field] as string, variant)) {
          throw new Error(`Contenu non valide dans le champ ${field}`);
        }
      } catch (error) {
        console.error(`Erreur sanitisation ${field}:`, error);
        throw new Error(`Contenu invalide dans le champ ${field}`);
      }
    }
  });

  // Sanitiser les champs texte simple avec les bons types
  textFields.forEach(field => {
    if (sanitizedBody[field] && typeof sanitizedBody[field] === 'string') {
      try {
        const fieldValue = sanitizedBody[field] as string;
        
        // Détecter le type approprié pour sanitizeFormField
        let fieldType: 'text' | 'email' | 'phone' | 'url' | 'motivation' | 'job' | 'city' | 'name' = 'text';
        if (field.includes('email')) fieldType = 'email';
        else if (field.includes('phone')) fieldType = 'phone';
        else if (field.includes('url') || field.includes('linkedin')) fieldType = 'url';
        else if (field === 'customMessage' || field === 'motivation') fieldType = 'motivation';
        else if (field === 'job' || field === 'jobTitle') fieldType = 'job';
        else if (field === 'city' || field === 'localisation') fieldType = 'city';
        else if (field === 'name' || field === 'nom') fieldType = 'name';
        
        // Utiliser sanitizeFormField au lieu de sanitizeTextMessage
        sanitizedBody[field] = sanitizeFormField(fieldValue, fieldType);
      } catch (error) {
        console.error(`Erreur sanitisation ${field}:`, error);
        throw new Error(`Contenu invalide dans le champ ${field}`);
      }
    }
  });

  // Sanitiser les métadonnées
  if (sanitizedBody.meta && typeof sanitizedBody.meta === 'object') {
    const meta = sanitizedBody.meta as Record<string, unknown>;
    if (meta.title && typeof meta.title === 'string') {
      meta.title = sanitizeTextMessage(meta.title, 100);
    }
    if (meta.description && typeof meta.description === 'string') {
      meta.description = sanitizeTextMessage(meta.description, 300);
    }
    if (meta.keywords && Array.isArray(meta.keywords)) {
      meta.keywords = meta.keywords
        .map((keyword: unknown) => typeof keyword === 'string' ? sanitizeTextMessage(keyword, 50) : '')
        .filter(keyword => keyword.length > 0);
    }
  }

  return sanitizedBody;
}

/**
 * Middleware de sécurité pour les APIs
 */
export async function securityMiddleware(
  request: NextRequest,
  handler: (req: NextRequest, sanitizedBody?: Record<string, unknown>) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    allowedRoles?: string[];
    variant?: 'basic' | 'full';
    skipRateLimit?: boolean;
  } = {}
): Promise<NextResponse> {
  try {
    // 1. Rate limiting
    if (!options.skipRateLimit) {
      const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      
      if (!checkRateLimit(clientIP)) {
        return NextResponse.json(
          { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
          { status: 429 }
        );
      }
    }

    // 2. Vérification de l'authentification
    if (options.requireAuth) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Authentification requise' },
          { status: 401 }
        );
      }

      // Vérification des rôles
      if (options.allowedRoles && !options.allowedRoles.includes(session.user.role)) {
        return NextResponse.json(
          { error: 'Accès non autorisé pour ce rôle' },
          { status: 403 }
        );
      }
    }

    // 3. Sanitisation du body pour les requêtes POST/PUT
    let sanitizedBody;
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const body = await request.json();
        sanitizedBody = sanitizeRequestBody(body, options.variant || 'basic');
      } catch (error) {
        if (error instanceof Error && error.message.includes('Contenu invalide')) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
        // Si ce n'est pas une erreur de parsing JSON, continuer sans body
        sanitizedBody = undefined;
      }
    }

    // 4. Headers de sécurité
    const response = await handler(request, sanitizedBody);
    
    // Ajouter les headers de sécurité
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error) {
    console.error('Erreur dans le middleware de sécurité:', error);
    return NextResponse.json(
      { error: 'Erreur de sécurité' },
      { status: 500 }
    );
  }
}

/**
 * Helper pour les logs de sécurité
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>,
  level: 'info' | 'warn' | 'error' = 'info'
) {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    ...details
  };

  switch (level) {
    case 'error':
      console.error('🚨 SECURITY EVENT:', logData);
      break;
    case 'warn':
      console.warn('⚠️ SECURITY WARNING:', logData);
      break;
    default:
      console.info('ℹ️ SECURITY INFO:', logData);
  }
}