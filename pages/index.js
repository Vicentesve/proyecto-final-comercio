import Head from "next/head";
import Header from "../components/Header";

export default function Home({ acciones }) {
  console.log({ acciones });
  return (
    <div>
      <Head>
        <title>Proyecto Final</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
    </div>
  );
}
