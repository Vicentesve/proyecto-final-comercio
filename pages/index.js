import Head from "next/head";
import Header from "../components/Header";
import React, { useState } from "react";
import SideNav from "../components/SideNav";

export default function Home() {
  const [state, setNavOpen] = useState(false);
  const openNav = () => {
    setNavOpen(true);
  };
  const closeNav = () => {
    setNavOpen(false);
  };
  return (
    <div>
      <SideNav click={closeNav} state={state} />

      <div
        className={`bg-gray-200 top-0 right-0 w-full h-full -z-100 ${
          state ? "fixed" : "static"
        }`}
      >
        <Head>
          <title>Proyecto Final</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header click={openNav} />
      </div>
    </div>
  );
}
