import Image from "next/image";
import Banner from "./components/Banner";
import BookList from "./components/BookList";

export default async function Home() {
  // data fetching
  const response = await fetch(`${process.env.BACKEND_URL}/books`);
  if (!response.ok) {
    throw new Error("Error occurred while fetching books");
  }
  const books = await response.json();
  console.log("books", books);

  return (
    <>
      <Banner />
      <BookList books={books} />
    </>
  );
}

// for making it client component write top 'use client'
// this is server component by default in next.js
//// end code
