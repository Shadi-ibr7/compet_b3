# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Molty is a Next.js 15 application with TypeScript that serves as a platform for local commerce and professional opportunities. It's a French-language platform featuring job listings (annonces), articles/blog posts, and mentor connections.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint linting
- `npm run seed:articles` - Seed articles data to Firestore
- `npm run seed:mentors` - Seed mentors data to Firestore

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Firebase Firestore with Firebase Admin SDK
- **Authentication**: NextAuth.js with Google OAuth provider
- **Styling**: Tailwind CSS v4 + CSS Modules
- **Language**: TypeScript with strict typing
- **Security**: DOMPurify for XSS protection with custom security middleware

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components organized by feature
- `src/lib/` - Utility functions, Firebase config, auth setup, and security systems
- `src/lib/middleware/` - API security middleware and request validation
- `src/hooks/` - Custom React hooks including security hooks
- `src/types/interfaces/` - TypeScript interfaces for data models
- `src/types/enums/` - TypeScript enums for data validation and consistency
- `src/styles/` - CSS modules and global styles
- `scripts/` - Database seeding scripts

### Data Models
Core interfaces are in `src/types/interfaces/`:
- `IBaseUser` - Base user with role-based access (UserRole enum)
- `IArticle` - Blog articles with meta tags and admin reference
- `IAnnonce` - Job/opportunity listings with mentor reference
- `IMentor` - Mentor profiles extending base user
- `IAdmin` - Admin users extending base user

### Authentication & Authorization
- Uses NextAuth.js with custom Firebase adapter
- Google OAuth integration
- Role-based access control (UserRole enum)
- JWT strategy with session callbacks for role management

### Firebase Integration
- Client-side config in `src/lib/firebase.ts`
- Admin SDK in `src/lib/firebase-admin.ts`
- Custom Firebase adapter for NextAuth at `src/lib/auth/firebase-adapter.ts`
- Storage utilities in `src/lib/firebase-storage.ts`

### Component Architecture
Components are organized by feature:
- `Home/` - Landing page sections and homepage components
- `Blog/` - Article display and cards
- `annonces/` - Job listings, forms, and job cards
- `mentors/` - Mentor profiles, cards, and listing page
- `auth/` - Authentication components and forms
- `dashboard/` - User profile management with role-based dashboards

### API Routes
RESTful API structure:
- `/api/articles` - CRUD operations for articles
- `/api/annonces` - CRUD operations for job listings
  - `/api/annonces/[id]` - Individual annonce operations (GET, PUT, DELETE)
  - `/api/annonces/mentor/[id]` - Get annonces by mentor
- `/api/mentors` - CRUD operations for mentor profiles
  - `/api/mentors/[id]` - Individual mentor operations (GET, PUT)
- `/api/auth/[...nextauth]` - NextAuth configuration
- `/api/upload` - File upload handling with Firebase Storage

### Styling Patterns
- Mix of Tailwind classes and CSS Modules
- Global styles in `src/app/globals.css`
- Feature-specific modules in `src/styles/`
- Custom background color `#fefff3` set globally

## Recent Features & Development Sessions

### Session 1: Dashboard Enhancement & Annonce Management
**Date**: Latest development session
**Features Added**:
- **Annonce Modification & Deletion**: 
  - Created `/annonces/[id]/edit` page for annonce editing
  - Added delete functionality with confirmation modal in mentor dashboard
  - Implemented secure API operations with ownership validation
- **Enhanced Mentor Dashboard**:
  - Added grouped action buttons (Modify/Delete)
  - Improved error handling and loading states
  - Better UX with confirmation dialogs
- **Bug Fixes**:
  - Resolved infinite loading loop in mentor dashboard
  - Fixed missing alt attributes in images for accessibility
  - Corrected import paths for consistent casing

### Session 2: Mentors Page Implementation
**Date**: Previous development session  
**Features Added**:
- **Complete Mentors Listing Page** (`/mentors`):
  - New API endpoint `/api/mentors` for listing all mentors
  - MentorsSection component with search and filtering
  - MentorCard component matching homepage design
  - Responsive grid layout for mentor cards
- **Data & Seeding**:
  - Created `seedMentors.js` script for populating test data
  - Added 3 sample mentors (Sophie Martin, Paul Dubois, Marie Leroy)
  - Comprehensive mentor profiles with ratings and descriptions
- **Design Consistency**:
  - Adapted homepage mentor card design for listing page
  - Horizontal layout with avatar + info structure
  - Consistent styling with existing color scheme
- **Search & Filtering**:
  - Real-time search across name, job, location, description
  - Filter buttons for location and sector (UI ready)
  - Loading, error, and empty states handling

### Session 3: Email System Enhancement & Bug Fixes
**Date**: Previous development session
**Features Added**:
- **Custom Message Feature for Job Applications**:
  - Added optional custom message field to job application form
  - 500 character limit with real-time counter
  - Only available to premium Molt users (`paid: true`)
  - Integrated into email template with special styling
- **EmailJS Template Bug Fixes**:
  - Resolved "Template: One or more dynamic variables are corrupted" error
  - Fixed JavaScript expression `{{molt_name.charAt(0).toUpperCase()}}` that EmailJS couldn't process
  - Created `molt_initial` variable calculated server-side for avatar initial
  - Updated EmailParams interface to include new variable
- **Email Template Improvements**:
  - Added dedicated section for custom messages with gradient styling
  - Enhanced template documentation with complete variable list
  - Improved fallback handling for undefined variables
- **Code Quality Enhancements**:
  - Added proper TypeScript typing for all email parameters
  - Implemented safer variable handling in emailService.ts
  - Added comprehensive logging for email debugging

### Session 4: Application Tracking & Duplicate Prevention System
**Date**: Previous development session
**Features Implemented**:
- **Application Database Schema**:
  - Created `IApplication` interface with comprehensive tracking fields
  - New Firestore collection `applications` with unique compound indexing
  - Added `ApplicationStatus` enum for future workflow management
- **Secure API Infrastructure**:
  - `/api/applications` endpoint with role-based access control
  - `/api/applications/check/[moltId]/[annonceId]` for real-time verification
  - Server-side validation preventing duplicate applications
  - Comprehensive error handling with user-friendly messages
- **Email Service Integration**:
  - Modified `sendApplicationEmail()` to record applications before sending
  - Added `checkApplicationExists()` utility function
  - Implemented transaction-like behavior (application recorded → email sent)
  - Enhanced error handling with proper rollback logic
- **Frontend Application Logic**:
  - Added `hasApplied` and `isCheckingApplication` state management
  - Real-time application status checking on page load
  - Dynamic UI updates based on application status
  - Fail-safe approach: allow applications on verification errors
- **Enhanced User Experience**:
  - New `alreadyApplied` CSS class with green checkmark styling
  - Disabled button state for submitted applications
  - Clear visual feedback: "Candidature envoyée ✓"
  - Loading states during application verification
- **Security & Performance**:
  - Double validation: client-side checking + server-side enforcement
  - Optimized Firestore queries with proper indexing
  - Role-based access control on all endpoints
  - ID resolution fixes for session vs profile mismatches

### Session 5: Comprehensive Security System Implementation
**Date**: Latest development session
**Features Implemented**:
- **Enterprise-Grade XSS Protection**:
  - DOMPurify integration for client-side HTML sanitization
  - Multi-layer security validation (client + server + middleware)
  - Automatic detection and logging of malicious content attempts
  - Configurable sanitization variants (basic/full) for different content types
- **Universal Form Security**:
  - Created `useSafeInput` hook for automatic field sanitization
  - Type-aware validation with 13 different field types (email, phone, url, description, etc.)
  - Real-time sanitization without compromising user experience
  - Secured all user forms across the platform (authentication, profiles, content creation)
- **API Security Middleware**:
  - Implemented `securityMiddleware` for all sensitive endpoints
  - Rate limiting (50 requests/minute) with IP-based tracking
  - Request body sanitization before processing
  - Security headers injection (X-XSS-Protection, Content-Type-Options, etc.)
  - Role-based access control integration
- **Enhanced Content Management**:
  - Secured FormattedTextArea component with XSS prevention
  - Preserved whitespace handling for better UX in descriptions/motivations
  - Content validation with automatic threat detection
  - HTML sanitization while maintaining rich formatting capabilities
- **User Experience Improvements**:
  - Fixed textarea whitespace preservation for mentor descriptions and user motivations
  - Seamless security integration without disrupting existing workflows
  - Maintained performance while adding comprehensive protection
  - Error handling with user-friendly security messages
- **Security Infrastructure**:
  - Extended `src/lib/security.ts` with 8 new security functions
  - Created `src/lib/middleware/security.ts` for API protection
  - Added `src/hooks/useSafeInput.ts` for universal form security
  - Comprehensive logging and monitoring for security events

### Session 6: Annonce Types Enhancement & User Experience
**Date**: Latest development session
**Features Implemented**:
- **Improved Annonce Type System**:
  - Replaced generic mentorat types with relevant French job market categories
  - Added 9 practical types: CDI, CDD, Stage, Alternance, Freelance/Mission, Échange & Conseil, Formation, Reconversion, Bénévolat
  - Organized types in logical groups: "Opportunités d'emploi" and "Mentorat & Accompagnement"
  - Enhanced user experience with descriptive labels and categorized options
- **TypeScript Enum Implementation**:
  - Created `AnnonceType` enum in `/src/types/enums/annonce-types.enum.ts`
  - Added `ANNONCE_TYPE_CONFIG` with metadata for each type
  - Implemented helper functions for type validation and categorization
  - Maintained backward compatibility with existing string-based types
- **Enhanced Form UX**:
  - Updated label from "Type de mentorat" to "Type d'opportunité" for clarity
  - Implemented grouped select options with `<optgroup>` for better organization
  - Dynamic rendering of options from centralized configuration
  - Improved maintainability with enum-driven approach
- **Code Quality Improvements**:
  - Centralized type definitions for easier maintenance
  - Added validation functions for type checking
  - Enhanced TypeScript typing for better developer experience
  - Future-proof architecture for adding new types

## Development Methodology

### Code Quality Standards
- **Type Safety**: Strict TypeScript with comprehensive interfaces
- **Accessibility**: Alt texts, semantic HTML, keyboard navigation
- **Error Handling**: Comprehensive try-catch blocks and user feedback
- **Security**: Multi-layer XSS protection, role-based access validation, and automatic sanitization on all user inputs
- **Form Security**: Mandatory use of `useSafeInput` hook for all user input fields
- **API Security**: Required `securityMiddleware` on all sensitive endpoints

### Development Approach
- **Component Reusability**: Shared CSS modules and component patterns
- **API Design**: RESTful endpoints with consistent error responses
- **Database Operations**: Firestore integration with proper data validation
- **Testing Strategy**: Manual testing with seeded data for consistent results

### Problem-Solving Process
1. **Debug-First Approach**: Add comprehensive logging to identify issues
2. **Incremental Development**: Build features step-by-step with testing
3. **Code Cleanup**: Remove debug logs and refactor for production
4. **Documentation**: Update CLAUDE.md with new features and patterns

### File Organization Principles
- **Feature-Based Structure**: Components grouped by functionality
- **Clear Naming**: Descriptive file and function names
- **Separation of Concerns**: Logic, styling, and data layers separated
- **Consistent Patterns**: Similar components follow same structure

## Important Notes

- Firebase requires environment variables for both client and admin SDKs
- The app uses French language throughout the interface
- Role-based access is critical - always check user roles for sensitive operations
- File uploads are handled through Firebase Storage
- Database seeding scripts are available for development data
- Always test with multiple data entries to ensure proper functionality
- Debug logging can be temporarily added for troubleshooting (remember to clean up)
- Component styles should reuse existing patterns when possible
- **SECURITY CRITICAL**: All user inputs must use `useSafeInput` hook or proper sanitization
- **SECURITY CRITICAL**: All APIs handling user data must use `securityMiddleware`
- **XSS Prevention**: Never use dangerouslySetInnerHTML without DOMPurify sanitization

## Email System Implementation

### EmailJS Integration
- **Service**: Uses EmailJS for sending application emails to mentors
- **Template**: `email-template.html` in root directory with comprehensive styling
- **Configuration**: Requires 3 environment variables:
  - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
  - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

### Email Template Variables
The template supports these dynamic variables:
- `{{to_name}}` - Mentor name (recipient)
- `{{molt_name}}` - Applicant full name
- `{{molt_initial}}` - First letter of applicant name (for avatar)
- `{{molt_email}}` - Applicant email address
- `{{molt_city}}` - Applicant city
- `{{molt_job_title}}` - Applicant current job title
- `{{molt_motivation}}` - Applicant motivation text
- `{{molt_linkedin}}` - Applicant LinkedIn profile URL
- `{{molt_experiences}}` - Formatted list of experiences
- `{{custom_message}}` - Optional personalized message (premium feature)
- `{{annonce_title}}` - Job posting title
- `{{annonce_company}}` - Company name
- `{{annonce_location}}` - Job location
- `{{annonce_description}}` - Job description
- `{{application_date}}` - Formatted application timestamp

### Critical Email Template Requirements
- **No JavaScript**: EmailJS templates cannot execute JavaScript expressions
- **Simple Variables Only**: Use `{{variable_name}}` format, not `{{variable.method()}}`
- **Fallback Values**: All variables must have fallback values to prevent corruption
- **Variable Validation**: Server-side validation ensures no undefined variables are sent

## Application Tracking System

### Database Schema
- **Collection**: `applications` in Firestore
- **Unique Constraint**: Composite index on `moltId + annonceId` prevents duplicates
- **Fields**: moltId, annonceId, mentorId, applicationDate, customMessage, status

### API Endpoints
- `POST /api/applications` - Create new application (validates uniqueness)
- `GET /api/applications?annonceId=X` - Check if user applied to specific job
- `GET /api/applications/check/[moltId]/[annonceId]` - Direct verification endpoint

### Application Flow
1. **Page Load**: Check if user already applied via `checkApplicationExists()`
2. **UI Update**: Show appropriate button state (apply/already applied)
3. **Application Submit**: Record in database BEFORE sending email
4. **Email Send**: Only proceeds if database record successful
5. **State Update**: Mark `hasApplied = true` on success

### Security Features
- **Role Validation**: Only Molts can create applications
- **Ownership Check**: Users can only check their own applications
- **Server Validation**: Double-check uniqueness on server side
- **Fail-Safe**: Allow applications if verification fails (avoid blocking users)

### Error Handling
- **ID Resolution**: Use session ID as fallback for profile ID mismatches
- **Network Errors**: Graceful degradation with user-friendly messages
- **Database Errors**: Transaction-like rollback if email fails after recording

## Security System Architecture

### Core Security Components

#### DOMPurify Integration
- **Client-Side Sanitization**: Real-time HTML cleaning with configurable policies
- **Variant System**: `basic` (for simple content) and `full` (for rich content with links/headers)
- **Threat Detection**: Automatic logging of malicious content attempts
- **Performance**: Optimized for minimal impact on user experience

#### useSafeInput Hook (`src/hooks/useSafeInput.ts`)
- **Universal Form Security**: Single hook for all input field sanitization
- **Type-Aware Validation**: 13 different field types with appropriate limits:
  - `name` (100 chars), `email` (150 chars), `phone` (20 chars)
  - `city` (100 chars), `address` (200 chars), `url` (300 chars)
  - `job` (100 chars), `description` (1000 chars), `motivation` (500 chars)
  - `company` (100 chars), `title` (100 chars), `location` (100 chars)
  - `password` (128 chars), `text` (200 chars)
- **Real-Time Sanitization**: Automatic cleaning on every value change
- **Whitespace Preservation**: Special handling for description/motivation fields
- **Error Management**: Built-in error states and validation feedback

#### Security Middleware (`src/lib/middleware/security.ts`)
- **Rate Limiting**: 50 requests per minute per IP address
- **Request Sanitization**: Automatic body cleaning before processing
- **Security Headers**: X-XSS-Protection, X-Content-Type-Options, X-Frame-Options
- **Role-Based Access**: Integration with NextAuth session validation
- **Content Validation**: Multi-layer checking for malicious patterns

#### Enhanced Security Functions (`src/lib/security.ts`)
- **`sanitizeHtml()`**: Core HTML sanitization with DOMPurify integration
- **`sanitizeFormField()`**: Type-aware field sanitization
- **`sanitizeTextMessage()`**: Text-only sanitization with whitespace options
- **`sanitizeRichContent()`**: Specialized for rich text editors
- **`validateContent()`**: Content validation and threat detection
- **`markdownToSafeHtml()`**: Safe markdown-to-HTML conversion

### Security Implementation Standards

#### Form Security Protocol
1. **Mandatory Hook Usage**: All form inputs must use `useSafeInput`
2. **Type Declaration**: Specify appropriate field type for validation
3. **Error Handling**: Implement proper error states and user feedback
4. **Real-Time Validation**: Provide immediate feedback on invalid input

#### API Security Protocol
1. **Middleware Requirement**: All sensitive endpoints must use `securityMiddleware`
2. **Authentication Check**: Verify user session and role permissions
3. **Request Sanitization**: Clean all incoming data before processing
4. **Response Security**: Apply security headers to all responses

#### Content Security Standards
- **No Raw HTML**: Never render user HTML without sanitization
- **DOMPurify First**: Always use DOMPurify for HTML content
- **Variant Selection**: Choose appropriate sanitization level (basic/full)
- **Logging**: Monitor and log security events for analysis

### Security Monitoring & Logging
- **Threat Detection**: Automatic identification of XSS attempts
- **Security Events**: Comprehensive logging of suspicious activities
- **Performance Monitoring**: Track sanitization impact on user experience
- **Error Tracking**: Monitor validation failures and security blocks

### Testing Security Features
Use these XSS injection test cases to verify protection:
```html
<!-- Basic Script Injection -->
<script>alert('XSS')</script>

<!-- Event Handler Injection -->
<img src="x" onerror="alert('XSS')">

<!-- JavaScript URL -->
<a href="javascript:alert('XSS')">Click me</a>

<!-- SVG XSS -->
<svg onload="alert('XSS')"></svg>

<!-- Form Field XSS -->
"><script>alert('XSS')</script>
```

All test cases should be blocked and logged by the security system.

## API Interface Documentation

### Complete API Specification

#### Authentication Endpoints
```typescript
// POST /api/auth/[...nextauth]
// NextAuth.js configuration with Google OAuth
interface NextAuthOptions {
  providers: [GoogleProvider]
  adapter: FirebaseAdapter
  session: { strategy: "jwt" }
  callbacks: {
    jwt: (token, user, account) => Promise<JWT>
    session: (session, token) => Promise<Session>
  }
}
```

#### Articles API (`/api/articles`)
```typescript
// GET /api/articles - List all articles
interface ArticlesResponse {
  articles: IArticle[]
  total: number
}

// POST /api/articles - Create new article (Admin only)
interface CreateArticleRequest {
  title: string
  content: string
  excerpt: string
  tags: string[]
  metaDescription?: string
  featured?: boolean
}

interface CreateArticleResponse {
  success: boolean
  article?: IArticle
  error?: string
}
```

#### Annonces API (`/api/annonces`)
```typescript
// GET /api/annonces - List all job listings
interface AnnoncesResponse {
  annonces: IAnnonce[]
  total: number
}

// POST /api/annonces - Create new job listing (Mentor only)
interface CreateAnnonceRequest {
  title: string
  description: string
  company: string
  location: string
  type: AnnonceType
  requirements?: string
  salary?: string
  benefits?: string
}

// GET /api/annonces/[id] - Get specific annonce
interface AnnonceResponse {
  success: boolean
  annonce?: IAnnonce
  error?: string
}

// PUT /api/annonces/[id] - Update annonce (Owner only)
interface UpdateAnnonceRequest extends Partial<CreateAnnonceRequest> {
  id: string
}

// DELETE /api/annonces/[id] - Delete annonce (Owner only)
interface DeleteAnnonceResponse {
  success: boolean
  message?: string
  error?: string
}

// GET /api/annonces/mentor/[id] - Get annonces by mentor
interface MentorAnnoncesResponse {
  annonces: IAnnonce[]
  mentorId: string
}
```

#### Mentors API (`/api/mentors`)
```typescript
// GET /api/mentors - List all mentors
interface MentorsResponse {
  mentors: IMentor[]
  total: number
}

// POST /api/mentors - Create mentor profile (User upgrade)
interface CreateMentorRequest {
  jobTitle: string
  company: string
  location: string
  description: string
  expertise: string[]
  linkedinUrl?: string
  experience?: string
  rating?: number
}

// GET /api/mentors/[id] - Get specific mentor
interface MentorResponse {
  success: boolean
  mentor?: IMentor
  error?: string
}

// PUT /api/mentors/[id] - Update mentor profile (Owner only)
interface UpdateMentorRequest extends Partial<CreateMentorRequest> {
  id: string
}
```

#### Applications API (`/api/applications`)
```typescript
// POST /api/applications - Submit job application (Molt only)
interface CreateApplicationRequest {
  annonceId: string
  mentorId: string
  customMessage?: string
}

interface CreateApplicationResponse {
  success: boolean
  applicationId?: string
  error?: string
}

// GET /api/applications/check/[moltId]/[annonceId] - Check application status
interface ApplicationCheckResponse {
  hasApplied: boolean
  applicationDate?: string
}

// GET /api/applications?annonceId=X - Get applications for annonce (Mentor only)
interface ApplicationsListResponse {
  applications: IApplication[]
  total: number
}
```

#### Upload API (`/api/upload`)
```typescript
// POST /api/upload - Upload file to Firebase Storage
interface UploadRequest {
  file: File
  folder: 'avatars' | 'documents' | 'images'
}

interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}
```

### API Response Standards

#### Success Response Format
```typescript
interface SuccessResponse<T = any> {
  success: true
  data?: T
  message?: string
}
```

#### Error Response Format
```typescript
interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: any
}
```

#### Security Headers (Applied by securityMiddleware)
```typescript
interface SecurityHeaders {
  'X-XSS-Protection': '1; mode=block'
  'X-Content-Type-Options': 'nosniff'
  'X-Frame-Options': 'DENY'
  'Content-Security-Policy': string
}
```

#### Rate Limiting
- **Limit**: 50 requests per minute per IP
- **Window**: 60 seconds
- **Storage**: In-memory Map with TTL
- **Response**: 429 Too Many Requests

### API Middleware Chain

#### Security Middleware Flow
1. **Rate Limiting Check**: Verify request count per IP
2. **Authentication**: Validate NextAuth session
3. **Role Authorization**: Check user role permissions
4. **Request Sanitization**: Clean request body with DOMPurify
5. **Security Headers**: Apply protective headers
6. **Logging**: Record security events and suspicious activity

#### Error Handling Middleware
```typescript
interface APIError extends Error {
  statusCode: number
  code?: string
  details?: any
}

const errorHandler = (error: APIError, req: NextApiRequest, res: NextApiResponse) => {
  const statusCode = error.statusCode || 500
  const response: ErrorResponse = {
    success: false,
    error: error.message,
    code: error.code
  }
  
  if (process.env.NODE_ENV === 'development') {
    response.details = error.stack
  }
  
  res.status(statusCode).json(response)
}
```

## Database Schema & Firestore Structure

### Collections Overview
```typescript
interface FirestoreCollections {
  users: IBaseUser[]           // Base user accounts
  mentors: IMentor[]           // Mentor profiles (extends users)
  admins: IAdmin[]             // Admin profiles (extends users)
  annonces: IAnnonce[]         // Job listings
  articles: IArticle[]         // Blog articles
  applications: IApplication[] // Job applications
}
```

### Detailed Collection Schemas

#### Users Collection (`users`)
```typescript
interface IBaseUser {
  id: string                    // Firestore document ID
  email: string                 // Primary identifier
  name: string                  // Full name
  image?: string               // Profile picture URL
  role: UserRole               // MOLT | MENTOR | ADMIN
  city?: string                // User location
  jobTitle?: string            // Current job
  linkedinUrl?: string         // LinkedIn profile
  motivation?: string          // User motivation text
  experiences?: string[]       // Professional experiences
  paid?: boolean              // Premium status
  createdAt: Timestamp         // Account creation
  updatedAt: Timestamp         // Last modification
}

enum UserRole {
  MOLT = 'molt',              // Regular user/job seeker
  MENTOR = 'mentor',          // Mentor/employer
  ADMIN = 'admin'             // Platform administrator
}
```

#### Mentors Collection (`mentors`)
```typescript
interface IMentor extends IBaseUser {
  role: UserRole.MENTOR
  company: string              // Company name
  location: string             // Work location
  description: string          // Mentor description
  expertise: string[]          // Areas of expertise
  experience: string           // Years of experience
  rating?: number             // Mentor rating (1-5)
  verified?: boolean          // Verification status
  availableFor?: string[]     // Available services
}
```

#### Annonces Collection (`annonces`)
```typescript
interface IAnnonce {
  id: string                   // Firestore document ID
  title: string                // Job title
  description: string          // Job description
  company: string              // Company name
  location: string             // Job location
  type: AnnonceType           // Job type (CDI, CDD, etc.)
  requirements?: string        // Job requirements
  salary?: string             // Salary information
  benefits?: string           // Job benefits
  mentorId: string            // Reference to mentor
  mentor?: IMentor            // Populated mentor data
  createdAt: Timestamp        // Creation date
  updatedAt: Timestamp        // Last update
  expiresAt?: Timestamp       // Expiration date
  active: boolean             // Active status
}

enum AnnonceType {
  CDI = 'cdi',
  CDD = 'cdd',
  STAGE = 'stage',
  ALTERNANCE = 'alternance',
  FREELANCE = 'freelance',
  CONSEIL = 'conseil',
  FORMATION = 'formation',
  RECONVERSION = 'reconversion',
  BENEVOLAT = 'benevolat'
}
```

#### Applications Collection (`applications`)
```typescript
interface IApplication {
  id: string                   // Firestore document ID
  moltId: string              // Applicant user ID
  annonceId: string           // Job listing ID
  mentorId: string            // Mentor ID (for direct queries)
  applicationDate: Timestamp   // Application timestamp
  customMessage?: string       // Optional personal message
  status: ApplicationStatus    // Application status
  createdAt: Timestamp        // Creation date
  updatedAt: Timestamp        // Last update
}

enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

// Firestore Indexes
interface ApplicationIndexes {
  // Composite index for uniqueness
  'moltId_annonceId': { moltId: 'asc', annonceId: 'asc' }
  // Query indexes
  'moltId': { moltId: 'asc', applicationDate: 'desc' }
  'mentorId': { mentorId: 'asc', applicationDate: 'desc' }
  'annonceId': { annonceId: 'asc', applicationDate: 'desc' }
}
```

#### Articles Collection (`articles`)
```typescript
interface IArticle {
  id: string                   // Firestore document ID
  title: string                // Article title
  content: string              // Article content (HTML)
  excerpt: string              // Short description
  tags: string[]              // Article tags
  metaDescription?: string     // SEO meta description
  featured?: boolean          // Featured article flag
  adminId: string             // Author (admin) ID
  admin?: IAdmin              // Populated admin data
  createdAt: Timestamp        // Publication date
  updatedAt: Timestamp        // Last modification
  publishedAt?: Timestamp     // Publication timestamp
  draft?: boolean             // Draft status
}
```

### Firestore Security Rules
```javascript
// Example security rules structure
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Mentors can create/update their annonces
    match /annonces/{annonceId} {
      allow read: if true;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'mentor';
      allow update, delete: if request.auth != null && 
        resource.data.mentorId == request.auth.uid;
    }
    
    // Applications with strict access control
    match /applications/{applicationId} {
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'molt';
      allow read: if request.auth != null && 
        (resource.data.moltId == request.auth.uid || 
         resource.data.mentorId == request.auth.uid);
    }
  }
}
```

## Component Interface Patterns

### Standard Component Props Interfaces

#### Form Components
```typescript
interface FormComponentProps {
  onSubmit: (data: any) => Promise<void>
  loading?: boolean
  error?: string
  initialData?: any
  className?: string
}

// Example: AnnonceForm
interface AnnonceFormProps extends FormComponentProps {
  onSubmit: (data: CreateAnnonceRequest) => Promise<void>
  initialData?: Partial<IAnnonce>
  mode: 'create' | 'edit'
}
```

#### Card Components
```typescript
interface CardComponentProps {
  data: any
  onClick?: () => void
  className?: string
  showActions?: boolean
  actionButtons?: React.ReactNode
}

// Example: AnnonceCard
interface AnnonceCardProps extends CardComponentProps {
  data: IAnnonce
  onApply?: () => void
  hasApplied?: boolean
  showMentorInfo?: boolean
}
```

#### List Components
```typescript
interface ListComponentProps<T> {
  items: T[]
  loading?: boolean
  error?: string
  emptyMessage?: string
  renderItem: (item: T) => React.ReactNode
  className?: string
}

// Example: AnnoncesSection
interface AnnoncesListProps extends ListComponentProps<IAnnonce> {
  searchQuery?: string
  filters?: AnnonceFilters
  onSearch?: (query: string) => void
  onFilter?: (filters: AnnonceFilters) => void
}
```

#### Modal Components
```typescript
interface ModalComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Example: ConfirmationModal
interface ConfirmationModalProps extends ModalComponentProps {
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}
```

### Component State Management Patterns

#### Loading States
```typescript
interface LoadingState {
  loading: boolean
  error: string | null
  data: any | null
}

// Hook pattern
const useLoadingState = <T>() => {
  const [state, setState] = useState<LoadingState & { data: T | null }>({
    loading: false,
    error: null,
    data: null
  })
  
  const setLoading = (loading: boolean) => 
    setState(prev => ({ ...prev, loading }))
  
  const setError = (error: string | null) => 
    setState(prev => ({ ...prev, error, loading: false }))
  
  const setData = (data: T) => 
    setState(prev => ({ ...prev, data, loading: false, error: null }))
  
  return { ...state, setLoading, setError, setData }
}
```

#### Form State Management
```typescript
interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

// Security-aware form hook
const useSecureForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: any
) => {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true
  })
  
  // Integration with useSafeInput for security
  const secureHandleChange = (field: keyof T, value: any) => {
    const sanitizedValue = sanitizeFormField(value, getFieldType(field))
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: sanitizedValue },
      touched: { ...prev.touched, [field]: true }
    }))
  }
  
  return { ...state, handleChange: secureHandleChange }
}
```

### CSS Module Patterns

#### Component Styling Structure
```css
/* Standard component CSS module structure */
.container {
  /* Container styles */
}

.header {
  /* Header section */
}

.content {
  /* Main content area */
}

.actions {
  /* Action buttons area */
}

.loading {
  /* Loading state styles */
}

.error {
  /* Error state styles */
}

.empty {
  /* Empty state styles */
}

/* Responsive modifiers */
.container.mobile {
  /* Mobile styles */
}

.container.tablet {
  /* Tablet styles */
}

/* State modifiers */
.container.disabled {
  /* Disabled state */
}

.container.active {
  /* Active state */
}
```

#### Consistent Color Variables
```css
/* Used across all components */
:root {
  --background-color: #fefff3;
  --primary-color: #4a90e2;
  --secondary-color: #7b68ee;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  --shadow-light: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-medium: 0 4px 8px rgba(0,0,0,0.15);
}
```

## Authentication Flow & Session Management

### NextAuth.js Configuration
```typescript
// /api/auth/[...nextauth].ts
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { FirebaseAdapter } from '@/lib/auth/firebase-adapter'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  adapter: FirebaseAdapter(),
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // Add user role to JWT token
      if (user) {
        const userDoc = await getUserFromFirestore(user.email!)
        token.role = userDoc?.role || 'molt'
        token.id = userDoc?.id
      }
      return token
    },
    session: async ({ session, token }) => {
      // Add role and ID to session
      session.user.role = token.role as UserRole
      session.user.id = token.id as string
      return session
    }
  }
}
```

### Session Management Patterns

#### Server-Side Session Handling
```typescript
// API route session validation
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/api/auth/[...nextauth]'

export const validateSession = async (req: NextApiRequest) => {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}

export const validateRole = (session: Session, requiredRole: UserRole) => {
  if (session.user.role !== requiredRole) {
    throw new Error('Insufficient permissions')
  }
}
```

#### Client-Side Session Hooks
```typescript
// Custom session hook with role checking
import { useSession } from 'next-auth/react'

export const useAuthSession = () => {
  const { data: session, status } = useSession()
  
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const user = session?.user
  
  const hasRole = (role: UserRole) => user?.role === role
  const isMolt = () => hasRole(UserRole.MOLT)
  const isMentor = () => hasRole(UserRole.MENTOR)
  const isAdmin = () => hasRole(UserRole.ADMIN)
  
  return {
    session,
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    isMolt,
    isMentor,
    isAdmin
  }
}
```

### Role-Based Access Control

#### Component-Level Access Control
```typescript
interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = null
}) => {
  const { user, isLoading } = useAuthSession()
  
  if (isLoading) return <div>Loading...</div>
  
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback
  }
  
  return <>{children}</>
}

// Usage
<RoleGuard allowedRoles={[UserRole.MENTOR, UserRole.ADMIN]}>
  <CreateAnnonceButton />
</RoleGuard>
```

#### API Route Protection
```typescript
// Middleware for API route protection
export const withAuth = (
  handler: NextApiHandler,
  options?: { requiredRole?: UserRole }
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await validateSession(req, res)
      
      if (options?.requiredRole) {
        validateRole(session, options.requiredRole)
      }
      
      // Add session to request for use in handler
      req.session = session
      
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      })
    }
  }
}

// Usage
export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // Handler logic with req.session available
  },
  { requiredRole: UserRole.MENTOR }
)
```

## Environment Variables & Configuration

### Required Environment Variables
```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-client-email
FIREBASE_ADMIN_PRIVATE_KEY=your-private-key

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key

# Security
SECURITY_SALT=your-security-salt
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=50
```

### Configuration Files Structure
```typescript
// /src/lib/config.ts
export const config = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
  },
  emailjs: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  },
  security: {
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '50'),
    securitySalt: process.env.SECURITY_SALT!
  }
}
```