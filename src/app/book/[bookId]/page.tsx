import React from "react";
import Image from "next/image";
import { Book } from "@/types";
import DownloadButton from "./components/DownloadButton";

const SingleBookPage = async ({ params }: { params: { bookId: string } }) => {
  console.log("Received route params:", params);

  const { bookId } = params;
  console.log("Extracted bookId:", bookId);

  let book: Book | null = null;

  try {
    console.log("Starting fetch request...");
    const response = await fetch(`${process.env.BACKEND_URL}/books/${bookId}`, {
      next: { revalidate: 3600 },
    });

    console.log("Received fetch response with status:", response.status);

    if (!response.ok) {
      throw new Error("Error fetching book");
    }

    const data = await response.json();
    book = data;
    console.log("Received book data:", book);
    console.log("Parsed book data:", book);
  } catch (err: any) {
    console.error("Fetch failed:", err);
    throw new Error("Error fetching book");
  }

  if (!book) {
    console.error("Book not found");
    throw new Error("Book not found");
  }

  console.log("Rendering book page...");

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
