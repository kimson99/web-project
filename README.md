# BookReview Platform

A comprehensive book review and library management platform built with React and Laravel. Users can discover books, write reviews, track their reading progress, and manage their personal libraries.

## 📚 Features

### Core Functionality
- **Book Discovery** - Browse and search through a vast collection of books
- **User Reviews** - Write and read detailed book reviews
- **Personal Library** - Track books you're reading, want to read, or have completed
- **Reading Progress** - Monitor current page and take notes while reading
- **Rating System** - Rate books and see average ratings from other users
- **Book Information** - Detailed book data including authors, genres, ISBN, publication year

### User Features
- **Authentication** - Secure user registration and login
- **User Profiles** - Customizable profiles with avatars
- **Library Management** - Organize books by reading status
- **Personal Notes** - Add private notes to your books

### Admin Features
- **Book Management** - Add, edit, and manage book catalog
- **User Management** - Administrative controls
- **Review Moderation** - Manage user-generated content

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Powerful data fetching and caching
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS

### Backend
- **Laravel 12** - Modern PHP framework
- **PHP 8.2+** - Latest PHP features
- **Laravel Sanctum** - API authentication
- **MySQL** - Database
- **Scramble** - API documentation generator

### External APIs
- **OpenLibrary API** - Book data and cover images
- **Book Scraper** - Python-based data collection tool

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **Lefthook** - Git hooks for code quality
- **ESLint** - Code linting
- **TypeScript** - Type safety across the stack
- **Generated TypeScript Client** - Auto-generated from OpenAPI spec

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v20 or higher)
- **pnpm** - Install with `npm install -g pnpm`
- **PHP** (8.2 or higher)
- **Composer** - PHP package manager
- **MySQL** (8.0 or higher)
- **Git**

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd web-project
```

### 2. Install Dependencies

Install all workspace dependencies:

```bash
pnpm install
```

### 3. Backend Setup

Navigate to the backend directory and set up Laravel:

```bash
cd packages/backend
```

#### Environment Configuration

Copy the environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

- Database configuration (MySQL)
- Application key (will be generated in next step)
- Any other environment-specific settings

#### Generate Application Key

```bash
php artisan key:generate
```

#### Database Setup

Create your MySQL database and update the `.env` file with your database credentials.

Run migrations:

```bash
php artisan migrate
```

#### Install PHP Dependencies

```bash
composer install
```

### 4. Frontend Setup

Navigate to the frontend directory:

```bash
cd packages/frontend
```

#### Environment Configuration

Copy the environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

- API base URL (typically `http://localhost:8000/api`)
- Any other frontend-specific environment variables

### 5. API Client Generation

Generate the TypeScript API client from the OpenAPI spec:

```bash
cd packages/api
pnpm generate
```

## Development

### Start Development Servers

From the root directory, you can start both frontend and backend:

```bash
# Start backend (Laravel)
pnpm be dev

# In another terminal, start frontend (React)
pnpm fe dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Available Scripts

#### Root Level

- `pnpm fe` - Run frontend commands
- `pnpm be` - Run backend commands

#### Frontend (`packages/frontend`)

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

#### Backend (`packages/backend`)

- `pnpm dev` - Start development server with queue and logs
- `pnpm test` - Run tests
- `composer test` - Run PHPUnit tests

#### API (`packages/api`)

- `pnpm generate` - Generate TypeScript client from OpenAPI spec

## Code Quality

This project uses Lefthook for git hooks to ensure code quality:

- **Pre-commit**: Automatically runs linting on staged files
- **Frontend**: ESLint with TypeScript rules
- **Backend**: Laravel Pint for PHP code style

## Project Structure

```
web-project/
├── packages/
│   ├── frontend/          # React + TypeScript application
│   ├── backend/           # Laravel API
│   └── api/              # Generated TypeScript client
├── lefthook.yml          # Git hooks configuration
└── package.json          # Workspace configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## License

[Add your license information here]
