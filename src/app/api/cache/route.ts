import { NextRequest, NextResponse } from "next/server";
import { cacheManager } from "@/utils/cacheManager";

// GET - Get cache statistics
export async function GET() {
  console.log("[CACHE_API] GET request - fetching cache statistics");

  try {
    const stats = cacheManager.getCacheStats();

    console.log("[CACHE_API] Cache statistics retrieved:", {
      totalCacheKeys: stats.totalCacheKeys,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "[CACHE_API] Error getting cache stats:",
      (error as Error).message
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get cache statistics",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE - Clear caches
export async function DELETE(request: NextRequest) {
  console.log("[CACHE_API] DELETE request - clearing caches");

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const clearAll = searchParams.get("all") === "true";

    if (clearAll) {
      console.log("[CACHE_API] Clearing all caches");
      cacheManager.clearAllCaches();

      return NextResponse.json({
        success: true,
        message: "All caches cleared successfully",
        timestamp: new Date().toISOString(),
      });
    } else if (key) {
      console.log("[CACHE_API] Clearing cache for key:", key);
      cacheManager.clearCache(key);

      return NextResponse.json({
        success: true,
        message: `Cache cleared for key: ${key}`,
        key,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log(
        "[CACHE_API] Invalid request - no key or all parameter provided"
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Please provide either a cache key or set all=true to clear all caches",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(
      "[CACHE_API] Error clearing cache:",
      (error as Error).message
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear cache",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST - Force refresh data (clear cache and trigger revalidation)
export async function POST(request: NextRequest) {
  console.log("[CACHE_API] POST request - force refresh data");

  try {
    const body = await request.json();
    const { endpoint, revalidate = true } = body;

    if (endpoint) {
      console.log("[CACHE_API] Force refreshing specific endpoint:", endpoint);

      // Clear cache for specific endpoint
      cacheManager.clearCache(endpoint);

      if (revalidate) {
        // Trigger a fresh fetch to populate cache
        try {
          const response = await cacheManager.fetchWithCacheManagement(
            `${process.env.BACKEND_URL}${endpoint}`
          );

          console.log("[CACHE_API] Fresh data fetched:", {
            endpoint,
            status: response.status,
            ok: response.ok,
          });
        } catch (fetchError) {
          console.warn(
            "[CACHE_API] Failed to fetch fresh data:",
            (fetchError as Error).message
          );
        }
      }

      return NextResponse.json({
        success: true,
        message: `Data refreshed for endpoint: ${endpoint}`,
        endpoint,
        revalidated: revalidate,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log("[CACHE_API] Force refreshing all data");

      // Clear all caches
      cacheManager.clearAllCaches();

      return NextResponse.json({
        success: true,
        message: "All data refreshed successfully",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error(
      "[CACHE_API] Error during force refresh:",
      (error as Error).message
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
