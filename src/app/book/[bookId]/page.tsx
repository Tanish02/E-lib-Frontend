import React from "react";
import Image from "next/image";
import { Book } from "@/types";
import DownloadButton from "./components/DownloadButton";
import { cacheManager } from "@/utils/cacheManager";

const SingleBookPage = async ({ params }: { params: { bookId: string } }) => {
  console.log("[SINGLE_BOOK] Received route params:", params);

  const { bookId } = params;
  console.log("[SINGLE_BOOK] Extracted bookId:", bookId);

  let book: Book | null = null;

  try {
    console.log("[SINGLE_BOOK] Starting fetch request for book:", bookId);

    // Use cache manager for automatic cache clearing and fresh data fetching
    const response = await cacheManager.fetchWithCacheManagement(
      `${process.env.BACKEND_URL}/books/${bookId}`
    );

    console.log("[SINGLE_BOOK] Received fetch response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      bookId,
      timestamp: new Date().toISOString(),
    });

    if (!response.ok) {
      console.error("[SINGLE_BOOK] Fetch failed:", {
        status: response.status,
        statusText: response.statusText,
        bookId,
      });
      throw new Error(
        `Error fetching book: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    book = data;

    console.log("[SINGLE_BOOK] Book data parsed successfully:", {
      bookId: book?._id,
      title: book?.title,
      author:
        typeof book?.author === "string" ? book.author : book?.author?.name,
      hasDescription: !!book?.description,
      hasCoverImage: !!book?.coverImage,
      hasFile: !!book?.file,
      timestamp: new Date().toISOString(),
    });

    // Log cache statistics
    const cacheStats = cacheManager.getCacheStats();
    console.log("[SINGLE_BOOK] Current cache statistics:", cacheStats);
  } catch (err: unknown) {
    console.error("[SINGLE_BOOK] Fetch failed:", {
      error: (err as Error).message,
      bookId,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`Error fetching book: ${(err as Error).message}`);
  }

  if (!book) {
    console.error("[SINGLE_BOOK] Book not found:", {
      bookId,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Book not found");
  }

  console.log("[SINGLE_BOOK] Rendering book page for:", {
    bookId: book._id,
    title: book.title,
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-3 gap-10 px-5 py-10">
      <div className="col-span-2 pr-16 text-primary-950">
        <h2 className="mb-5 text-5xl font-bold leading-[1.1]">{book.title}</h2>
        <span className="font-semibold">
          by{" "}
          {typeof book.author === "string"
            ? book.author
            : book.author?.name || "Unknown Author"}
        </span>

        <p className="mt-5 text-lg leading-8">{book.description}</p>
        <DownloadButton fileLink={book.file} />
      </div>
      <div className="flex justify-end">
        <Image
          src={book.coverImage}
          alt={book.title}
          className="rounded-md border"
          height={0}
          width={0}
          sizes="100vw"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default SingleBookPage;
