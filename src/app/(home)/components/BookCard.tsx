import { Book } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BookCard = ({ book }: { book: Book }) => {
  return (
    <div
      className="flex gap-5 border border-gray-300 
    p-5 shadow-md rounded-lg"
    >
      <Image
        src={book.coverImage}
        alt={book.title}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "auto", height: "12rem" }}
      />
      <div>
        <h2
          className="line-clamp-2 test-xl font-bold
         text-orange-600 text-balance"
        >
          {book.title}
        </h2>
        <p className="font-bold text-orange-900 mt-1">{book.author.name}</p>
        <Link
          href={`/book/${book._id}`}
          className="text-blue-500 font-medium text-sm 
          hover:underline hover:border-blue-500 hover:bg-blue-200 py-1 px-2
          rounded border border-blue-500 mt-15 inline-block transition"
        >
          More Info →
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
