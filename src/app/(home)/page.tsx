// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
import Banner from "./components/Banner";
import ProductList from "./components/ProductList";

export default function Home() {
  return (
    <>
      <Banner />
      <ProductList />
    </>
  );
}
