# Cache Management System

## Overview

The E-Lib frontend includes a lightweight client-side cache management system designed to help ensure that users always receive fresh data from the backend API.

The system tracks API requests, detects when cached data may be outdated, and provides tools for clearing and refreshing cached entries when necessary.

It is implemented using three main parts:

- `CacheManager` (core cache logic)
- `useCacheManager` (React hook for UI integration)
- `CacheControl` (optional debug interface)

This system is primarily intended for **development visibility and cache debugging**, while ensuring fresh API responses in production.

---

# Architecture

The cache system is divided into three layers.

```
CacheManager (core logic)
        ↓
useCacheManager Hook
        ↓
CacheControl Debug UI
```

| Layer           | Responsibility                                                |
| --------------- | ------------------------------------------------------------- |
| CacheManager    | Tracks API fetch timestamps and manages cache invalidation    |
| useCacheManager | Provides React state and functions to interact with the cache |
| CacheControl    | Optional UI component for viewing and clearing caches         |

---

# Core Component: CacheManager

Location:

```
src/utils/cacheManager.ts
```

`CacheManager` is implemented as a **singleton class**, ensuring that the same cache state is shared across the entire application.

## Responsibilities

The manager handles:

- tracking API request timestamps
- detecting possible backend updates
- clearing outdated cache entries
- logging cache operations
- providing cache statistics

### Singleton Pattern

The cache manager uses a singleton design pattern:

```ts
const cacheManager = CacheManager.getInstance();
```

This guarantees a **single shared cache manager instance** throughout the application.

---

# Cache Tracking

The system stores two primary structures.

### Last Fetch Timestamps

```
Map<string, number>
```

Stores the timestamp of the last successful fetch for each API endpoint.

Example:

```
/api/books → 1710000000000
/api/books/123 → 1710000004000
```

---

### Cache Keys

```
Set<string>
```

Tracks all currently known cached endpoints.

Example:

```
[
  "/api/books",
  "/api/books/123"
]
```

---

# Automatic Cache Invalidation

Before performing a fetch request, the system checks whether the backend data may have changed.

```
checkForDatabaseUpdates(endpoint)
```

This function sends a request to:

```
/endpoint/last-updated
```

If the backend returns a newer timestamp than the locally stored fetch time, the cache entry is cleared.

```
serverTimestamp > cachedTimestamp
```

If an update is detected:

1. The cache entry is cleared
2. A fresh request is made
3. The timestamp is updated

If the update check fails, the system defaults to **fetching fresh data**.

---

# Fetch With Cache Management

All managed requests use:

```ts
cacheManager.fetchWithCacheManagement(url, options);
```

This method performs the following sequence:

1. Check if backend data has changed
2. Clear stale cache entries if necessary
3. Fetch fresh data from the server
4. Update fetch timestamps
5. Log the request result

The request uses a **no-store cache policy** to ensure fresh responses.

```
Cache-Control: no-cache, no-store, must-revalidate
```

---

# Cache Clearing

## Clear Specific Cache

```ts
cacheManager.clearCache(key);
```

Removes a single endpoint from the cache.

This also attempts to remove matching entries from the browser Cache API if available.

---

## Clear All Cache

```ts
cacheManager.clearAllCaches();
```

This operation:

- removes all tracked cache keys
- clears stored timestamps
- deletes browser cache entries when possible

---

# Cache Statistics

Developers can retrieve cache information using:

```ts
cacheManager.getCacheStats();
```

Returned data includes:

| Field               | Description                         |
| ------------------- | ----------------------------------- |
| totalCacheKeys      | number of cached endpoints          |
| cacheKeys           | list of cached URLs                 |
| lastFetchTimestamps | timestamps of last successful fetch |
| oldestCache         | earliest cached request             |
| newestCache         | most recent cached request          |

These statistics are primarily used for debugging and monitoring.

---

# React Hook: useCacheManager

Location:

```
src/hooks/useCacheManager.ts
```

This hook exposes cache operations to React components.

Example usage:

```ts
const {
  cacheStats,
  isClearing,
  clearCache,
  clearAllCaches,
  forceRefresh,
  refreshCacheStats,
} = useCacheManager();
```

### Available Controls

| Function          | Purpose                           |
| ----------------- | --------------------------------- |
| refreshCacheStats | updates cache statistics          |
| clearCache        | clears a specific cache entry     |
| clearAllCaches    | removes all cached entries        |
| forceRefresh      | clears cache and reloads the page |

---

# Debug Component: CacheControl

Location:

```
src/debug/CacheControl.tsx
```

`CacheControl` is a developer tool that provides a visual interface for cache monitoring.

Features include:

- displaying cache statistics
- viewing cached endpoints
- clearing individual cache keys
- clearing all caches
- forcing a full data refresh

This component is intended for **development and debugging only**.

---

# Logging

All cache operations are logged in the browser console using structured prefixes.

Example:

```
[CACHE MANAGER] FETCH_START
[CACHE MANAGER] DATABASE_UPDATE_DETECTED
[CACHE MANAGER] CLEARING_CACHE
[CACHE MANAGER] FETCH_SUCCESS
```

These logs help developers understand cache behavior during development and debugging.

---

# Usage Example

Example usage inside a component:

```ts
const response = await cacheManager.fetchWithCacheManagement(
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/books`,
);

const data = await response.json();
```

This ensures the request is processed through the cache management system.

---

# Development Notes

The cache system is designed primarily to:

- track request freshness
- provide debugging visibility
- allow manual cache invalidation during development

For larger applications, libraries such as **React Query** or **SWR** may provide more advanced caching strategies.

---

# Summary

The E-Lib cache system provides:

- centralized cache tracking
- timestamp-based invalidation
- manual cache control
- detailed logging
- debugging visibility

It serves as a lightweight mechanism for managing API request freshness while allowing developers to observe cache behavior during development.
