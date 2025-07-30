import React from "react";
import BookCard from "./BookCard";
import { Book } from "@/types";
import { cacheManager } from "@/utils/cacheManager";

const BookList = async () => {
  console.log("[BOOKLIST] Starting book list data fetching...");

  try {
    // Use cache manager for automatic cache clearing and fresh data fetching
    const response = await cacheManager.fetchWithCacheManagement(
      `${process.env.BACKEND_URL}/books`
    );

    console.log("[BOOKLIST] Fetch response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      timestamp: new Date().toISOString(),
    });

    if (!response.ok) {
      console.error("[BOOKLIST] Fetch failed with status:", response.status);
      throw new Error(
        `Error occurred while fetching books: ${response.status} ${response.statusText}`
      );
    }

    const books = await response.json();

    console.log("[BOOKLIST] Books data parsed successfully:", {
      totalBooks: books.length,
      bookIds: books.map((book: Book) => book._id),
      timestamp: new Date().toISOString(),
    });

    // Log cache statistics
    const cacheStats = cacheManager.getCacheStats();
    console.log("[BOOKLIST] Current cache statistics:", cacheStats);

    return (
      <div
        className="grid grid-cols-1 gap-8 md:grid-cols-3
       max-w-7xl mx-auto mb-10"
      >
        {books.map((book: Book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("[BOOKLIST] Error in BookList component:", {
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

// end code

export default BookList;
