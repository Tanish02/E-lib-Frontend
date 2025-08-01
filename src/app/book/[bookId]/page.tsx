import React from "react";
import Image from "next/image";
import { Book } from "@/types";
import DownloadButton from "./components/DownloadButton";
import { cacheManager } from "@/utils/cacheManager";

const SingleBookPage = async ({ params }: { params: { bookId: string } }) => {
  const { bookId } = params;
  let book: Book | null = null;

  try {
    // Use cache manager for automatic cache clearing and fresh data fetching
    const response = await cacheManager.fetchWithCacheManagement(
      `${process.env.BACKEND_URL}/books/${bookId}`
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching book: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    book = data;
  } catch (err: unknown) {
    console.error("[SINGLE_BOOK] Error fetching book:", (err as Error).message);
    throw new Error(`Error fetching book: ${(err as Error).message}`);
  }

  if (!book) {
    throw new Error("Book not found");
  }

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
