"use client";

import React from "react";
import { useCacheManager } from "@/hooks/useCacheManager";

const CacheControl: React.FC = () => {
  const {
    cacheStats,
    isClearing,
    clearCache,
    clearAllCaches,
    forceRefresh,
    refreshCacheStats,
  } = useCacheManager();

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeSince = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Cache Control
        </h3>

        {/* Cache Statistics */}
        {cacheStats && (
          <div className="mb-3 text-sm text-gray-600">
            <div className="mb-1">
              <strong>Active Caches:</strong> {cacheStats.totalCacheKeys}
            </div>
            {cacheStats.totalCacheKeys > 0 && (
              <>
                <div className="mb-1">
                  <strong>Oldest:</strong>{" "}
                  {formatTimestamp(cacheStats.oldestCache)}
                  <span className="text-xs text-gray-500 ml-1">
                    ({getTimeSince(cacheStats.oldestCache)})
                  </span>
                </div>
                <div className="mb-2">
                  <strong>Newest:</strong>{" "}
                  {formatTimestamp(cacheStats.newestCache)}
                  <span className="text-xs text-gray-500 ml-1">
                    ({getTimeSince(cacheStats.newestCache)})
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Cache Keys List */}
        {cacheStats && cacheStats.cacheKeys.length > 0 && (
          <div className="mb-3">
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-700 font-medium">
                Cache Keys ({cacheStats.cacheKeys.length})
              </summary>
              <div className="mt-2 max-h-32 overflow-y-auto">
                {cacheStats.cacheKeys.map((key, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-xs text-gray-600 truncate flex-1 mr-2">
                      {key.replace(
                        process.env.NEXT_PUBLIC_BACKEND_URL || "",
                        "..."
                      )}
                    </span>
                    <button
                      onClick={() => clearCache(key)}
                      disabled={isClearing}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 disabled:opacity-50"
                    >
                      Clear
                    </button>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="space-y-2">
        <button
          onClick={refreshCacheStats}
          disabled={isClearing}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClearing ? "Processing..." : "Refresh Stats"}
        </button>

        <button
          onClick={clearAllCaches}
          disabled={isClearing}
          className="w-full bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClearing ? "Clearing..." : "Clear All Caches"}
        </button>

        <button
          onClick={forceRefresh}
          disabled={isClearing}
          className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClearing ? "Refreshing..." : "Force Refresh Data"}
        </button>
      </div>

      {/* Status Indicator */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Auto-refresh: ON</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CacheControl;
