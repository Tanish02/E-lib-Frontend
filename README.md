# E-lib Frontend

A Next.js-based frontend application for a digital library service that displays books and enables downloads with integrated cache management.

## Technologies & Libraries

**Language & Runtime**
- TypeScript 5
- Node.js (via Next.js)
- JavaScript (ES2017+)

**Framework & Libraries**
- Next.js 15.3.1
- React 19
- React DOM 19

**Styling & UI**
- Tailwind CSS 4.1.5
- CSS (globals.css)

**Tooling & Development**
- ESLint 9 with Next.js config
- PostCSS 4
- Turbopack (Next.js bundler)

## Project Overview

E-lib Frontend is a Next.js application that serves as the user interface for a digital library. It fetches book data from a backend API, displays books in a searchable list, and provides individual book detail pages with download functionality. The application includes a custom cache management system that automatically detects data changes and clears stale cache entries to ensure fresh data is served to users.

## Repository Structure

```
src/
  app/
    (home)/              # Home page with book listing
      page.tsx
      components/
        Banner.tsx       # Homepage banner
        BookList.tsx     # Fetches and displays books
        BookCard.tsx     # Individual book card display
    api/
      cache/
        route.ts         # Cache statistics and management API
      webhook/
        cache-invalidate/
          route.ts       # Webhook endpoint for cache invalidation
    book/
      [bookId]/          # Dynamic book detail page
        page.tsx
        components/
          DownloadButton.tsx  # Book download functionality
    layout.tsx           # Root layout with Navbar and Footer
    globals.css          # Global styles
  components/            # Shared components
    CacheControl.tsx     # Manual cache control UI
    Footer.tsx
    Loading.tsx          # Loading state component
    Navbar.tsx
  hooks/
    useCacheManager.ts   # React hook for cache management operations
  utils/
    cacheManager.ts      # Cache management utility class
  types/
    index.tsx            # TypeScript type definitions (Book, Author)

Configuration Files
  next.config.ts        # Next.js configuration with cache headers and image domains
  tailwind.config.js    # Tailwind CSS configuration
  tsconfig.json         # TypeScript compiler configuration
  eslint.config.mjs     # ESLint configuration
  postcss.config.mjs    # PostCSS configuration
  package.json          # Dependencies and scripts
```

## Features / Implementations

- **Book Listing**: Displays books fetched from a backend API with cover images and metadata
- **Book Detail Pages**: Dynamic routes showing full book information with author details
- **Download Functionality**: Download button component for book files with error handling
- **Cache Management System**: Automatic cache clearing with timestamp-based detection and fresh data fetching
- **Cache Statistics API**: GET endpoint (`/api/cache`) to retrieve current cache state including cache keys and fetch timestamps
- **Cache Invalidation Webhook**: POST endpoint (`/api/webhook/cache-invalidate`) for external cache invalidation with API key validation
- **Manual Cache Control UI**: Visual component for cache clearing and monitoring
- **React Hooks Integration**: `useCacheManager` hook for client-side cache operations and statistics
- **Server-side Data Fetching**: Uses Next.js server components for optimized data loading
- **Loading States**: Suspense-based loading fallback with loading component
- **Responsive Layout**: Grid-based responsive design using Tailwind CSS
- **Cache-Control Headers**: HTTP headers configured to prevent caching of API responses and dynamic content

## Setup & Requirements

**Prerequisites**
- Node.js (version compatible with Next.js 15.3.1)
- npm or package manager

**Installation**
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

**Environment Variables**
Create a `.env` file with:
   ```
   BACKEND_URL=<backend API URL>
   CACHE_WEBHOOK_API_KEY=<optional API key for webhook validation>
   ```

## Usage

**Development Server**
```
npm run dev
```
Runs the development server on [http://localhost:3000](http://localhost:3000) using Turbopack.

**Production Build**
```
npm run build
npm start
```

**Linting**
```
npm run lint
```

**Accessing Features**
- Homepage: [http://localhost:3000](http://localhost:3000) displays the book list
- Book Details: [http://localhost:3000/book/[bookId]](http://localhost:3000/book/[bookId]) where `[bookId]` is a valid book ID
- Cache API: `GET /api/cache` returns cache statistics
- Cache Invalidation: `POST /api/webhook/cache-invalidate` with JSON body containing `action`, `resource`, `resourceId`, `timestamp`, and `apiKey`

## Scope & Intent

This repository is a frontend application for demonstration and active use. It is designed to integrate with a backend API and serve as a functional digital library interface.

## Limitations

- Backend URL must be configured via `CACHE_WEBHOOK_API_KEY` environment variable; no fallback or validation for missing configuration
- API key validation for webhook endpoint is optional and simple; not suitable for production security without enhancement
- No input validation on cache invalidation webhook payload
- Cache invalidation logic depends on backend API availability; no offline fallback
- Missing automated test coverage
- Book data structure is tightly coupled to backend API response format (assumes specific field names and structure)
- Cover images are hardcoded to Cloudinary; no flexibility for alternative image sources
- No error boundary or comprehensive error handling for failed book fetches beyond console logging
- Cache management timestamps use client-side clock; no synchronization with server time
- No pagination implemented for book listing; assumes backend returns all books at once

## Contributing

To contribute, submit a pull request with a clear description of changes. Ensure code follows the existing style conventions and passes linting checks.

## License

No license specified in this repository.
