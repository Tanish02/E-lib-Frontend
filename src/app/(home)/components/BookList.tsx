import React from "react";
import BookCard from "./BookCard";
import { Book } from "@/types";
import { cacheManager } from "@/utils/cacheManager";

const BookList = async () => {
  try {
    // Use cache manager for automatic cache clearing and fresh data fetching
    const response = await cacheManager.fetchWithCacheManagement(
      `${process.env.BACKEND_URL}/books`
    );

    if (!response.ok) {
      throw new Error(
        `Error occurred while fetching books: ${response.status} ${response.statusText}`
      );
    }

    const books = await response.json();

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
    console.error("[BOOKLIST] Error fetching books:", (error as Error).message);
    throw error;
  }
};

// end code

export default BookList;
