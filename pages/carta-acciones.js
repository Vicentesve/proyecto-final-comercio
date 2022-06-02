import { getSession } from "next-auth/react";
import React from "react";
import Header from "../components/Header";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import CarrouselCartas from "./../components/CarrouselCartas";

function CartaAcciones({ entriesData }) {
  return (
    <div>
      <Header />
      <div className="bg-white">
        <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
          {entriesData.length > 0
            ? "Mis cartas de confirmación"
            : "No tienes cartas de confirmación"}
        </h1>

        {entriesData.length > 0 ? (
          <div className="p-10 w-full justify-center flex flex-wrap ">
            <div className="w-[40%]">
              <CarrouselCartas cartas={entriesData} />
            </div>
          </div>
        ) : (
          <img
            className="object-contain sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] m-auto"
            src="noStock.jpg"
            alt=""
          />
        )}
      </div>
    </div>
  );
}

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
    collection(db, "users", session.user.email, "letter_stocks")
  );
  const entriesData = querySnapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));

  return {
    props: { session, entriesData },
  };
}

export default CartaAcciones;
