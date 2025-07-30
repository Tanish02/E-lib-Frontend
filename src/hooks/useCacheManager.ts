"use client";

import { useCallback, useEffect, useState } from "react";
import { cacheManager } from "@/utils/cacheManager";

export interface CacheStats {
  totalCacheKeys: number;
  cacheKeys: string[];
  lastFetchTimestamps: Record<string, number>;
  oldestCache: number;
  newestCache: number;
}

export const useCacheManager = () => {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  // Get current cache statistics
  const refreshCacheStats = useCallback(() => {
    console.log("[USE_CACHE_MANAGER] Refreshing cache statistics...");
    try {
      const stats = cacheManager.getCacheStats();
      setCacheStats(stats);
      console.log("[USE_CACHE_MANAGER] Cache stats updated:", stats);
    } catch (error) {
      console.error(
        "[USE_CACHE_MANAGER] Error getting cache stats:",
        (error as Error).message
      );
    }
  }, []);

  // Clear specific cache key
  const clearCache = useCallback(
    async (key: string) => {
      console.log("[USE_CACHE_MANAGER] Clearing cache for key:", key);
      setIsClearing(true);

      try {
        cacheManager.clearCache(key);
        console.log(
          "[USE_CACHE_MANAGER] Cache cleared successfully for key:",
          key
        );

        // Refresh stats after clearing
        setTimeout(() => {
          refreshCacheStats();
          setIsClearing(false);
        }, 100);
      } catch (error) {
        console.error(
          "[USE_CACHE_MANAGER] Error clearing cache:",
          (error as Error).message
        );
        setIsClearing(false);
      }
    },
    [refreshCacheStats]
  );

  // Clear all caches
  const clearAllCaches = useCallback(async () => {
    console.log("[USE_CACHE_MANAGER] Clearing all caches...");
    setIsClearing(true);

    try {
      cacheManager.clearAllCaches();
      console.log("[USE_CACHE_MANAGER] All caches cleared successfully");

      // Refresh stats after clearing
      setTimeout(() => {
        refreshCacheStats();
        setIsClearing(false);
      }, 100);
    } catch (error) {
      console.error(
        "[USE_CACHE_MANAGER] Error clearing all caches:",
        (error as Error).message
      );
      setIsClearing(false);
    }
  }, [refreshCacheStats]);

  // Force refresh data by clearing cache and reloading
  const forceRefresh = useCallback(async () => {
    console.log("[USE_CACHE_MANAGER] Force refreshing data...");
    setIsClearing(true);

    try {
      cacheManager.clearAllCaches();
      console.log("[USE_CACHE_MANAGER] Caches cleared, reloading page...");

      // Reload the page to fetch fresh data
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "[USE_CACHE_MANAGER] Error during force refresh:",
        (error as Error).message
      );
      setIsClearing(false);
    }
  }, []);

  // Auto-refresh cache stats on mount and periodically
  useEffect(() => {
    refreshCacheStats();

    // Set up periodic refresh of cache stats
    const interval = setInterval(refreshCacheStats, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [refreshCacheStats]);

  return {
    cacheStats,
    isClearing,
    clearCache,
    clearAllCaches,
    forceRefresh,
    refreshCacheStats,
  };
};
