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

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components organized by feature
- `src/lib/` - Utility functions, Firebase config, and auth setup  
- `src/types/interfaces/` - TypeScript interfaces for data models
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
**Date**: Latest development session
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

## Development Methodology

### Code Quality Standards
- **Type Safety**: Strict TypeScript with comprehensive interfaces
- **Accessibility**: Alt texts, semantic HTML, keyboard navigation
- **Error Handling**: Comprehensive try-catch blocks and user feedback
- **Security**: Role-based access validation on all sensitive operations

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