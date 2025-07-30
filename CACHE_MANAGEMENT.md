# Cache Management System

This document describes the comprehensive cache management system implemented in the E-lib Frontend application.

## Overview

The cache management system provides automatic cache clearing functionality with database update detection, comprehensive console logging, and fresh data fetching capabilities.

## Features

### 🔄 Automatic Cache Clearing

- Detects database updates automatically
- Clears stale cache entries when data changes
- Fetches fresh data after cache clearing

### 📊 Comprehensive Logging

- Detailed console logging for all cache operations
- Timestamps and operation tracking
- Error logging and debugging information

### 🎛️ Manual Cache Control

- Visual cache control component
- API endpoints for programmatic cache management
- Webhook support for external cache invalidation

### 🚀 Performance Optimization

- Intelligent cache key management
- Browser cache integration
- Pre-fetching of critical data

## Components

### 1. Cache Manager (`src/utils/cacheManager.ts`)

The core cache management utility that handles:

- Database update detection
- Cache clearing operations
- Fresh data fetching with automatic cache management
- Cache statistics and monitoring

**Key Methods:**

```typescript
// Check for database updates
await cacheManager.checkForDatabaseUpdates(endpoint);

// Fetch with automatic cache management
await cacheManager.fetchWithCacheManagement(url, options);

// Clear specific cache
cacheManager.clearCache(key);

// Clear all caches
cacheManager.clearAllCaches();

// Get cache statistics
cacheManager.getCacheStats();
```

### 2. Cache Control Hook (`src/hooks/useCacheManager.ts`)

React hook for client-side cache management:

```typescript
const {
  cacheStats,
  isClearing,
  clearCache,
  clearAllCaches,
  forceRefresh,
  refreshCacheStats,
} = useCacheManager();
```

### 3. Cache Control Component (`src/components/CacheControl.tsx`)

Visual interface for cache management:

- Real-time cache statistics
- Manual cache clearing buttons
- Individual cache key management
- Live status indicators

### 4. API Endpoints

#### Cache Management API (`/api/cache`)

- `GET` - Retrieve cache statistics
- `DELETE` - Clear specific or all caches
- `POST` - Force refresh data

#### Webhook API (`/api/webhook/cache-invalidate`)

- `POST` - Automatic cache invalidation from backend
- `GET` - Health check endpoint

## Implementation

### Updated Components

#### BookList Component

```typescript
// Uses cache manager for automatic cache clearing
const response = await cacheManager.fetchWithCacheManagement(
  `${process.env.BACKEND_URL}/books`
);
```

#### SingleBookPage Component

```typescript
// Automatic cache management with detailed logging
const response = await cacheManager.fetchWithCacheManagement(
  `${process.env.BACKEND_URL}/books/${bookId}`
);
```

### Next.js Configuration

Enhanced `next.config.ts` with:

- Disabled experimental stale times
- Cache-Control headers for all routes
- No-cache directives for fresh data

## Usage

### Automatic Cache Clearing

The system automatically:

1. Checks for database updates before each fetch
2. Clears stale cache entries when updates are detected
3. Fetches fresh data with comprehensive logging
4. Updates cache statistics in real-time

### Manual Cache Control

#### Using the Visual Component

- Located in the bottom-right corner of the application
- Shows real-time cache statistics
- Provides buttons for manual cache operations

#### Using API Endpoints

**Get Cache Statistics:**

```bash
GET /api/cache
```

**Clear All Caches:**

```bash
DELETE /api/cache?all=true
```

**Clear Specific Cache:**

```bash
DELETE /api/cache?key=https://api.example.com/books
```

**Force Refresh Data:**

```bash
POST /api/cache
Content-Type: application/json

{
  "endpoint": "/books",
  "revalidate": true
}
```

### Webhook Integration

Configure your backend to call the webhook when data changes:

```bash
POST /api/webhook/cache-invalidate
Content-Type: application/json

{
  "action": "update",
  "resource": "book",
  "resourceId": "123",
  "timestamp": "2024-01-01T00:00:00Z",
  "apiKey": "your-webhook-api-key"
}
```

## Environment Variables

Add to your `.env.local`:

```env
# Backend URL for API calls
BACKEND_URL=https://your-backend-api.com

# Webhook API key for security
CACHE_WEBHOOK_API_KEY=your-secure-api-key

# Public backend URL for client-side operations
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com
```

## Console Logging

The system provides detailed console logging with prefixes:

- `[CACHE MANAGER]` - Core cache manager operations
- `[BOOKLIST]` - Book list component operations
- `[SINGLE_BOOK]` - Single book page operations
- `[USE_CACHE_MANAGER]` - Client-side hook operations
- `[CACHE_API]` - API endpoint operations
- `[CACHE_WEBHOOK]` - Webhook operations

### Example Log Output

```
[CACHE MANAGER] 2024-01-01T00:00:00.000Z - CHECKING_DATABASE_UPDATES: /books
[CACHE MANAGER] 2024-01-01T00:00:00.000Z - DATABASE_UPDATE_DETECTED: https://api.example.com/books
[CACHE MANAGER] 2024-01-01T00:00:00.000Z - CLEARING_CACHE: https://api.example.com/books
[CACHE MANAGER] 2024-01-01T00:00:00.000Z - FETCHING_FRESH_DATA: https://api.example.com/books
[BOOKLIST] Books data parsed successfully: { totalBooks: 10, timestamp: "2024-01-01T00:00:00.000Z" }
```

## Monitoring

### Cache Statistics

The system tracks:

- Total active cache keys
- Last fetch timestamps
- Oldest and newest cache entries
- Cache hit/miss ratios

### Performance Metrics

Monitor console logs for:

- Fetch response times
- Cache clearing operations
- Database update detection
- Error rates and failures

## Troubleshooting

### Common Issues

1. **Cache not clearing**: Check console logs for error messages
2. **Webhook not working**: Verify API key and endpoint URL
3. **Stale data persisting**: Use force refresh functionality
4. **Performance issues**: Monitor cache statistics for excessive cache keys

### Debug Mode

Enable detailed logging by checking browser console for all cache operations with timestamps and detailed information.

## Best Practices

1. **Monitor cache statistics** regularly using the visual component
2. **Use webhooks** for automatic cache invalidation when possible
3. **Clear caches** after major data updates
4. **Check console logs** for debugging cache-related issues
5. **Use force refresh** when experiencing data inconsistencies

## Security

- Webhook endpoints are protected with API key authentication
- Cache operations are logged for audit purposes
- No sensitive data is stored in cache keys or statistics
