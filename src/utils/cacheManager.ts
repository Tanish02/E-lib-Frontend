// automatic cache clearing and fresh data fetching
export class CacheManager {
  private static instance: CacheManager;
  private lastFetchTimestamps: Map<string, number> = new Map();
  private cacheKeys: Set<string> = new Set();

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Log cache operations
  private log(
    operation: string,
    key: string,
    details?: Record<string, unknown>
  ) {
    const timestamp = new Date().toISOString();
    console.log(`[CACHE MANAGER] ${timestamp} - ${operation}:`, {
      key,
      operation,
      timestamp,
      ...details,
    });
  }

  // Check if data needs to be refreshed based on database updates
  async checkForDatabaseUpdates(endpoint: string): Promise<boolean> {
    try {
      this.log("CHECKING_DATABASE_UPDATES", endpoint);

      // Make a HEAD request to check last-modified or use a timestamp endpoint
      const response = await fetch(
        `${process.env.BACKEND_URL}${endpoint}/last-updated`,
        {
          method: "HEAD",
          cache: "no-store",
        }
      );

      if (response.ok) {
        const lastModified = response.headers.get("last-modified");
        const serverTimestamp = lastModified
          ? new Date(lastModified).getTime()
          : Date.now();
        const cachedTimestamp = this.lastFetchTimestamps.get(endpoint) || 0;

        const needsUpdate = serverTimestamp > cachedTimestamp;

        this.log("DATABASE_UPDATE_CHECK", endpoint, {
          serverTimestamp,
          cachedTimestamp,
          needsUpdate,
          lastModified,
        });

        return needsUpdate;
      }
    } catch (error) {
      this.log("DATABASE_UPDATE_CHECK_ERROR", endpoint, {
        error: (error as Error).message,
      });
      // If we can't check for updates, assume we need fresh data
      return true;
    }

    return true; // Default to fetching fresh data
  }

  // Clear cache for specific endpoint
  clearCache(key: string) {
    this.log("CLEARING_CACHE", key);
    this.lastFetchTimestamps.delete(key);
    this.cacheKeys.delete(key);

    // Clear browser cache if available
    if (typeof window !== "undefined" && "caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.open(cacheName).then((cache) => {
            cache.keys().then((requests) => {
              requests.forEach((request) => {
                if (request.url.includes(key)) {
                  cache.delete(request);
                  this.log("BROWSER_CACHE_CLEARED", key, { url: request.url });
                }
              });
            });
          });
        });
      });
    }
  }

  // Clear all caches
  clearAllCaches() {
    this.log("CLEARING_ALL_CACHES", "all");
    this.lastFetchTimestamps.clear();
    this.cacheKeys.clear();

    if (typeof window !== "undefined" && "caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
  }

  // Fetch data with automatic cache management
  async fetchWithCacheManagement(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const cacheKey = url;

    this.log("FETCH_START", cacheKey, { url, options });

    // Check if we need to update based on database changes
    const needsUpdate = await this.checkForDatabaseUpdates(
      url.replace(process.env.BACKEND_URL || "", "")
    );

    if (needsUpdate) {
      this.log("DATABASE_UPDATE_DETECTED", cacheKey);
      this.clearCache(cacheKey);
    }

    // Always fetch fresh data with no-store cache policy
    const fetchOptions: RequestInit = {
      ...options,
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        ...options.headers,
      },
    };

    this.log("FETCHING_FRESH_DATA", cacheKey, { fetchOptions });

    try {
      const response = await fetch(url, fetchOptions);

      if (response.ok) {
        // Update timestamp for successful fetch
        this.lastFetchTimestamps.set(cacheKey, Date.now());
        this.cacheKeys.add(cacheKey);

        this.log("FETCH_SUCCESS", cacheKey, {
          status: response.status,
          statusText: response.statusText,
          timestamp: Date.now(),
        });
      } else {
        this.log("FETCH_ERROR", cacheKey, {
          status: response.status,
          statusText: response.statusText,
        });
      }

      return response;
    } catch (error) {
      this.log("FETCH_EXCEPTION", cacheKey, {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  // Get cache statistics
  getCacheStats() {
    const stats = {
      totalCacheKeys: this.cacheKeys.size,
      cacheKeys: Array.from(this.cacheKeys),
      lastFetchTimestamps: Object.fromEntries(this.lastFetchTimestamps),
      oldestCache: Math.min(...Array.from(this.lastFetchTimestamps.values())),
      newestCache: Math.max(...Array.from(this.lastFetchTimestamps.values())),
    };

    this.log("CACHE_STATS", "stats", stats);
    return stats;
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();
