import { collection, getDocs, query } from "firebase/firestore";
import { getSession, useSession } from "next-auth/react";
import React, { useState } from "react";
import Header from "../components/Header";
import { db } from "../firebase/initFirebase";
import SideNav from "../components/SideNav";
import EmblaCarousel from "../components/EmblaCarousel";
import Ticket from "../components/Ticket";

function MisAcciones({ entriesData }) {
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
      {/* Header */}
      <Header click={openNav} />
      <div className="bg-white">
        <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
          {entriesData.length > 0 ? "Mis acciones" : "No tienes acciones"}
        </h1>
        {entriesData.length > 0 ? (
          <>
            <div className="sm:hidden">
              <EmblaCarousel acciones={entriesData} />
            </div>
            <div className="p-10 w-full sm:flex justify-around hidden flex-wrap">
              {entriesData.map((accion) => (
                <div
                  key={accion.id}
                  className="w-[45%] md:w-[40%] lg:w-[30%] xl:w-[25%] relative mb-10"
                >
                  <Ticket
                    key={accion.id}
                    id={accion.id}
                    nombre={accion.nombre}
                    fecha={accion.fecha}
                    cantidad={accion.cantidad}
                    valor={accion.valor}
                    comision={accion.comision}
                    iva={accion.iva}
                    total={accion.total}
                    urlImg={accion.urlImg}
                  />
                </div>
              ))}
            </div>
          </>
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
    collection(db, "users", session.user.email, "stocks")
  );
  const entriesData = querySnapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));

  return {
    props: { session, entriesData },
  };
}

export default MisAcciones;
