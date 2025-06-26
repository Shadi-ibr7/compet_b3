// Security middleware for API routes
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sanitizeProfile } from '@/lib/security';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 50;

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Check rate limit for an IP
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

/**
 * Sanitize request body recursively
 */
function sanitizeRequestBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  if (Array.isArray(body)) {
    return body.map(sanitizeRequestBody);
  }
  
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      // Apply basic sanitization to prevent XSS
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeRequestBody(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Security middleware for API routes
 */
export async function securityMiddleware(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    allowedRoles?: string[];
    rateLimited?: boolean;
  } = {}
): Promise<NextResponse> {
  const {
    requireAuth = false,
    allowedRoles = [],
    rateLimited = true
  } = options;

  try {
    // Rate limiting
    if (rateLimited) {
      const clientIP = getClientIP(request);
      
      if (!checkRateLimit(clientIP)) {
        console.warn(`[SECURITY] Rate limit exceeded for IP: ${clientIP}`);
        return NextResponse.json(
          { error: 'Trop de requêtes, veuillez réessayer plus tard' },
          { status: 429 }
        );
      }
    }

    // Authentication check
    if (requireAuth) {
      const session = await getServerSession();
      
      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'Authentification requise' },
          { status: 401 }
        );
      }

      // Role-based access control
      if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
        console.warn(`[SECURITY] Unauthorized role access: ${session.user.role} not in ${allowedRoles.join(', ')}`);
        return NextResponse.json(
          { error: 'Accès non autorisé' },
          { status: 403 }
        );
      }
    }

    // Sanitize request body for POST/PUT requests
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const body = await request.json();
        const sanitizedBody = sanitizeRequestBody(body);
        
        // Replace the original request with sanitized data
        const newRequest = new NextRequest(request.url, {
          ...request,
          body: JSON.stringify(sanitizedBody)
        });
        
        return handler(newRequest);
      } catch (error) {
        // If body parsing fails, continue with original request
        return handler(request);
      }
    }

    // Add security headers to response
    const response = await handler(request);
    
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;

  } catch (error) {
    console.error('[SECURITY] Security middleware error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * Higher-order function to wrap API handlers with security middleware
 */
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: {
    requireAuth?: boolean;
    allowedRoles?: string[];
    rateLimited?: boolean;
  }
) {
  return async (request: NextRequest) => {
    return securityMiddleware(request, handler, options);
  };
}

/**
 * Clean up old rate limit entries
 */
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

// Clean up rate limit store every 5 minutes
if (typeof global !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}