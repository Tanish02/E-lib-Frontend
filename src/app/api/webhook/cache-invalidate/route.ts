import { NextRequest, NextResponse } from "next/server";
import { cacheManager } from "@/utils/cacheManager";

// POST - Webhook endpoint for automatic cache invalidation
export async function POST(request: NextRequest) {
  console.log("[CACHE_WEBHOOK] Received cache invalidation webhook");

  try {
    const body = await request.json();
    const { action, resource, resourceId, timestamp, apiKey } = body;

    console.log("[CACHE_WEBHOOK] Webhook payload:", {
      action,
      resource,
      resourceId,
      timestamp,
      hasApiKey: !!apiKey,
      receivedAt: new Date().toISOString(),
    });

    // Simple API key validation (you should use environment variable)
    const expectedApiKey = process.env.CACHE_WEBHOOK_API_KEY;
    if (expectedApiKey && apiKey !== expectedApiKey) {
      console.error("[CACHE_WEBHOOK] Invalid API key provided");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Determine which caches to clear based on the resource and action
    const cachesToClear: string[] = [];

    switch (resource) {
      case "book":
      case "books":
        if (resourceId) {
          // Clear specific book cache
          cachesToClear.push(`${process.env.BACKEND_URL}/books/${resourceId}`);
          console.log(
            "[CACHE_WEBHOOK] Clearing cache for specific book:",
            resourceId
          );
        }
        // Always clear books list cache when any book is modified
        cachesToClear.push(`${process.env.BACKEND_URL}/books`);
        console.log("[CACHE_WEBHOOK] Clearing books list cache");
        break;

      case "author":
      case "authors":
        // Clear all book-related caches when author is modified
        cachesToClear.push(`${process.env.BACKEND_URL}/books`);
        if (resourceId) {
          cachesToClear.push(
            `${process.env.BACKEND_URL}/authors/${resourceId}`
          );
        }
        console.log("[CACHE_WEBHOOK] Clearing author-related caches");
        break;

      default:
        // Clear all caches for unknown resources
        console.log("[CACHE_WEBHOOK] Unknown resource, clearing all caches");
        cacheManager.clearAllCaches();

        return NextResponse.json({
          success: true,
          message: "All caches cleared due to unknown resource type",
          action,
          resource,
          timestamp: new Date().toISOString(),
        });
    }

    // Clear specific caches
    for (const cacheKey of cachesToClear) {
      console.log("[CACHE_WEBHOOK] Clearing cache for key:", cacheKey);
      cacheManager.clearCache(cacheKey);
    }

    // Log the action for monitoring
    console.log("[CACHE_WEBHOOK] Cache invalidation completed:", {
      action,
      resource,
      resourceId,
      clearedCaches: cachesToClear.length,
      cacheKeys: cachesToClear,
      timestamp: new Date().toISOString(),
    });

    // Optionally pre-fetch fresh data for critical endpoints
    if (action === "update" || action === "create") {
      console.log("[CACHE_WEBHOOK] Pre-fetching fresh data...");

      try {
        // Pre-fetch books list
        await cacheManager.fetchWithCacheManagement(
          `${process.env.BACKEND_URL}/books`
        );

        // Pre-fetch specific book if resourceId is provided
        if (resource === "book" && resourceId) {
          await cacheManager.fetchWithCacheManagement(
            `${process.env.BACKEND_URL}/books/${resourceId}`
          );
        }

        console.log("[CACHE_WEBHOOK] Fresh data pre-fetched successfully");
      } catch (prefetchError) {
        console.warn(
          "[CACHE_WEBHOOK] Failed to pre-fetch fresh data:",
          (prefetchError as Error).message
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cache invalidation completed successfully",
      action,
      resource,
      resourceId,
      clearedCaches: cachesToClear.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "[CACHE_WEBHOOK] Error processing webhook:",
      (error as Error).message
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process cache invalidation webhook",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET - Health check for webhook endpoint
export async function GET() {
  console.log("[CACHE_WEBHOOK] Health check requested");

  return NextResponse.json({
    success: true,
    message: "Cache invalidation webhook is healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      invalidate: "POST /api/webhook/cache-invalidate",
      health: "GET /api/webhook/cache-invalidate",
    },
  });
}
