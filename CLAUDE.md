# Book Review Web Application

## Project Overview

A full-stack book review and library management application built with modern web technologies.

### Tech Stack

- **Backend**: Laravel 11 (PHP) - RESTful API
- **Frontend**: React 19 + TypeScript - Single Page Application
- **Router**: TanStack Router - File-based routing
- **State Management**: TanStack Query - Server state & caching
- **Styling**: TailwindCSS + DaisyUI - Component library
- **Database**: MySQL - Relational database
- **API Documentation**: Laravel Scramble - OpenAPI generation
- **Type Generation**: @hey-api/openapi-ts - TypeScript API client

## Project Structure

```
packages/
├── backend/           # Laravel API server
│   ├── app/Http/Controllers/
│   ├── app/Models/
│   ├── app/Http/Resources/
│   ├── app/Http/Requests/
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/          # React SPA
│   ├── src/routes/    # TanStack Router pages
│   ├── src/components/ # Reusable components
│   ├── src/providers/ # React context providers
│   └── src/api/       # API client
├── api/               # Generated TypeScript types
│   └── generated/     # Auto-generated from backend
└── book-scraper/      # Python data scraping scripts
```

## Key Features

- **Authentication**: Laravel Sanctum (SPA authentication)
- **Book Management**: CRUD operations with search
- **Author Management**: Author profiles and search
- **User Library**: Personal book collections with reading status
- **Reviews & Ratings**: User-generated content
- **Search**: Full-text search for books and authors
- **Pagination**: Infinite scroll with React Query
- **Image Upload**: Book covers and user avatars
- **Responsive Design**: Mobile-first with DaisyUI

## Development Workflow

### Backend Commands

```bash
cd packages/backend
php artisan serve                    # Start dev server (port 8000)
php artisan migrate                  # Run database migrations
php artisan scramble:export          # Generate OpenAPI docs
```

### Frontend Commands

```bash
cd packages/frontend
npm run dev                          # Start dev server (port 5173)
npm run build                        # Production build
npm run lint                         # ESLint checking
```

### API Type Generation

```bash
# After backend changes, regenerate TypeScript types:
cd packages/backend
php artisan scramble:export --path=api.json
cd ../api
npm run generate
```

## Database Schema

### Core Models

- **Users**: Authentication, profiles, avatars
- **Books**: Title, ISBN, description, ratings, cover images
- **Authors**: Names, bios, avatars
- **Reviews**: User reviews with ratings
- **UserBooks**: User library with reading status
- **Genres**: Book categorization

### Key Relationships

- Books ↔ Authors (many-to-many)
- Books ↔ Genres (many-to-many)
- Users ↔ Books (many-to-many via UserBooks)
- Users ↔ Reviews (one-to-many)

## API Patterns

### Request Classes

All endpoints use Laravel Form Request classes for validation:

- `IndexBookRequest`, `StoreBookRequest`, etc.
- Consistent parameter naming: `skip`/`take` for pagination

### Resource Classes

API responses use Laravel API Resources:

- `BookResource`, `AuthorResource`, `UserResource`
- Consistent JSON structure with metadata

### Error Handling

- Laravel validation errors (422)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)

## Frontend Architecture

### Routing

File-based routing with TanStack Router:

- `/` - Homepage
- `/browse` - Search books/authors with infinite scroll
- `/auth/signin` & `/auth/signup` - Authentication
- `/my-library` - User's personal library

### State Management

- **Server State**: TanStack Query for API data
- **Client State**: React useState/useContext
- **URL State**: TanStack Router search params

### Component Structure

```
components/
├── Browse/           # Browse page components
│   ├── BookCard.tsx
│   ├── AuthorCard.tsx
│   ├── SearchInput.tsx
│   ├── SearchTabs.tsx
│   ├── BooksGrid.tsx
│   └── AuthorsGrid.tsx
├── Home/             # Homepage sections
├── NavBar.tsx        # Main navigation
├── Footer.tsx
└── Modal.tsx         # Reusable modal
```

## Code Conventions

### Backend (Laravel)

- PSR-12 coding standards
- Resource controllers with proper HTTP methods
- Make Request Reesource for each api
- Form Request validation for all inputs
- API Resources for consistent responses
- Eloquent models with proper relationships

### Frontend (React)

- Functional components with hooks
- TypeScript strict mode
- Props interfaces for all components
- Custom hooks for business logic
- Error boundaries for graceful failures
- **⚠️ MANDATORY: Always use DaisyUI classes for ALL UI components if possible(buttons, forms, cards, modals, etc.)**
- **Date handling**: Use dayjs for all date operations and formatting

  ```tsx
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  dayjs.extend(relativeTime);

  // Relative time display
  {
  	dayjs(review.created_at).fromNow();
  }
  ```

- **Toast notifications**: Use react-hot-toast for success/error messages instead of inline alerts

  ```tsx
  import toast from "react-hot-toast";

  // Success message
  toast.success("Review submitted successfully!");

  // Error message
  toast.error("Failed to submit review. Please try again.");
  ```

### API Integration

- Generated TypeScript types from OpenAPI
- Consistent error handling
- Loading states with React Query
- Optimistic updates where appropriate

## Environment Setup

### Database

- MySQL with full-text search indexes
- Seeded with sample data via factories
- Migrations for schema versioning

### Authentication

- Laravel Sanctum for SPA authentication
- CSRF protection enabled
- Session-based auth for web routes

### File Storage

- Local storage for development
- Public disk for user uploads
- Image optimization for covers/avatars

## Testing Strategy

- Laravel Feature tests for API endpoints
- Laravel Unit tests for business logic
- React Testing Library for components
- End-to-end tests with Playwright (planned)

## Current Status

✅ User authentication system
✅ Book and author CRUD operations  
✅ Author management with profiles
✅ Search functionality with full-text search
✅ Infinite scroll pagination
✅ Browse page with tabs (books & authors)
✅ Responsive design with DaisyUI
✅ API type generation workflow
✅ Navigation system (books, authors, user profiles)
✅ Featured books section with library integration
✅ Latest reviews section with time display
✅ Add to library functionality with status tracking
✅ Type-safe Laravel Resources (BookResource, AuthorResource, ReviewResource)
✅ Consistent UI components (BookCover, Avatar, Modal)
✅ Date handling with dayjs
✅ **Review System (Complete)**

- Review submission form with rating and content
- Review update functionality for existing reviews
- Unique review constraint (one per user per book)
- Review display in book detail pages with posted dates
- Toast notifications for success/error feedback
  ✅ **Smart Library Actions (Complete)**
- Split button design with main action + dropdown
- Dynamic button text/icon based on current status
- Status-aware UI (disabled when book already in library)
- Update library status functionality
- FontAwesome 6 icons for visual clarity
  ✅ **User Library Management (`/my-library`) - Complete!**
- Personal library dashboard with responsive grid layout
- Status filter tabs with real-time counts and search functionality
- Note-taking and page tracking with progress percentages
- Edit modal (status, current page, notes) accessible via dropdown
- Remove from library with confirmation modal
- Reading status enum with centralized configuration
- Professional UI with FontAwesome icons and consistent design
  ✅ **User Profile Pages (`/profiles/{userId}`) - Complete!**
- Backend API endpoint with UserProfileResource including reading stats and recent activity
- Public profile route with responsive design using DaisyUI colors
- Reading statistics sidebar with semantic color coding (success, info, warning)
- Recent reviews section (5 latest) with proper star ratings and book navigation
- Recent library activity with status badges and book navigation
- Navigation integration: user dropdown → profile, review cards → user profiles
- Click-through navigation from profile books to book detail pages
- Type-safe implementation with proper null handling
  ✅ **Admin Books Management - Complete!**
- Books listing with DaisyUI pagination (fixed backend count bug)
- Book creation with image upload via MediaController
- Book editing with optional image updates and proper validation
- Search, delete functionality with modals (fixed foreign key constraint)
  ✅ **Admin User Management - Complete!**
- User listing with search by name/email and role filtering
- Edit user functionality: name (for offensive names), role (member/admin), account status (active/suspended)
- Added `is_active` boolean field to users table with default true
- User statistics display (reviews count, books in library)
- React Hook Form integration with proper validation
- Professional UI with DaisyUI components and proper error handling
  ✅ **Admin Authentication & Authorization - Complete!**
- Frontend route protection checking `user.role === "admin"` with proper loading states
- Backend AdminMiddleware with role validation
- Admin layout with protected routes and redirect to signin
- Logout functionality integrated in admin sidebar

## Required Features

### **Admin Dashboard (`/admin`) - Complete!**

- [x] Book management (list, create, edit, delete)
- [x] Admin authentication & authorization with frontend route protection
- [x] User management (list, search, edit name/role/status)

## Navigation Patterns

### User Profile Navigation

- **Route**: `/profiles/{userId}` - User profile pages (planned feature)
- **Current Implementation**: User avatars and names in review cards are clickable and navigate to user profiles
- **Components**: Used in LatestBookReviewSection for reviewer names and avatars

## Important Notes

- Note user to regenerate API types after backend changes
- Use consistent naming: `skip`/`take` for pagination
- Follow component composition patterns
- Maintain type safety throughout the stack
- Use React Query for all server state
- Implement proper loading states with skeletons
- You can use type from API, prefer not to use any type, please do tell me in case you need it

### Laravel Resource Type Generation Best Practices

**IMPORTANT**: When creating Laravel API Resources, follow these patterns to ensure proper OpenAPI/TypeScript type generation:

1. **Relationship Arrays**: Always use dedicated Resource classes for relationships:

   ```php
   // ✅ GOOD - Generates proper array types
   'authors' => AuthorResource::collection($this->authors),

   // ❌ BAD - Generates as string type
   'authors' => $this->authors->map(function ($author) {
       return ['id' => $author->id, 'name' => $author->name];
   }),
   ```

2. **Conditional Fields**: Always include conditional fields in the main return array structure:

   ```php
   // ✅ GOOD - Always generates the field in schema
   return [
       'id' => $this->id,
       'user_data' => $userBook ? [...] : null,
   ];

   // ❌ BAD - Field missing from type generation
   if (auth()->check()) {
       $data['user_data'] = [...];
   }
   ```

3. **Resource Structure**: Let the Resource classes define the structure rather than complex PHPDoc annotations:

   ```php
   // ✅ GOOD - Laravel Scramble reads the actual Resource structure
   'user' => new UserResource($this->user),
   'authors' => AuthorResource::collection($this->authors),

   // ❌ AVOID - Complex PHPDoc annotations may not be parsed by Scramble
   /**
    * @return array{complex: array<nested, structure>}
    */
   ```

4. **Include Related Model IDs**: When including user-specific data, include the related model ID for updates:
   ```php
   // ✅ GOOD - Includes UserBook ID for frontend updates
   'user_data' => $userBook ? [
       'id' => $userBook->id,  // Essential for PATCH/PUT operations
       'reading_status' => $userBook->status,
       'current_page' => $userBook->current_page,
   ] : null,
   ```

**Note**: Laravel Scramble works best with actual Resource classes rather than PHPDoc type annotations. Check Scramble documentation for supported annotation patterns.
