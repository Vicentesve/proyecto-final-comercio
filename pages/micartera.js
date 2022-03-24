import Header from "../components/Header";
import SideNav from "../components/SideNav";
import React, { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import _, { groupBy } from "underscore";
import WalletCarousel from "../components/WalletCarousel";

function micartera({ wallet, entriesData }) {
  const { data: session } = useSession();
  const [accionID, setAccion] = useState(0);

  //#region variables sideNav
  const [state, setNavOpen] = useState(false);

  const openNav = () => {
    setNavOpen(true);
  };
  const closeNav = () => {
    setNavOpen(false);
  };
  //#endregion

  console.log(wallet);
  return (
    <div>
      <SideNav click={closeNav} state={state} />
      <Header click={openNav} />

      <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
        {Object.entries(wallet).length > 0
          ? "Tu Cartera"
          : "Tu Cartera está vacia"}
      </h1>

      <div className="m-auto p-4">
        {Object.entries(wallet).length > 0 ? (
          <div className="border border-[#c7bbbb] shadow-lg rounded-lg p-2">
            <WalletCarousel myWallet={wallet} entriesData={entriesData} />
          </div>
        ) : (
          <img src="bgNoWallet.png" alt="" />
        )}
      </div>
    </div>
  );
}

export default micartera;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const querySnapshot = await getDocs(
    collection(db, "users", session.user.email, "stocks")
  );
  const entriesData = querySnapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));

  const q = query(collection(db, "users", session.user.email, "myWallet"));

  const walletSnapshot = await getDocs(q);
  const walletDoc = walletSnapshot.docs.map((entry) => ({
    ...entry.data(),
  }));

  var wallet = _.groupBy(walletDoc, "accionID");

  return {
    props: { session, wallet, entriesData },
  };
}
