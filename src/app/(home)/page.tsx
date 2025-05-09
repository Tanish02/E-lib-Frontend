import Image from "next/image";
import Banner from "./components/Banner";
import BookList from "./components/BookList";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function Home() {


  return (
    <>
      <Banner />
      <Suspense fallback={<Loading />}>
            <BookList />
      </Suspense>
    </>
  );
}

// for making it client component write top 'use client'
// this is server component by default in next.js
//// end code
