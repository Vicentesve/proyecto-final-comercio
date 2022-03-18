import { collection, getDocs, query } from "firebase/firestore";
import { getSession, useSession } from "next-auth/react";
import React, { useState } from "react";
import CurrencyFormat from "react-currency-format";
import Header from "../components/Header";
import { db } from "../firebase/initFirebase";
import SideNav from "../components/SideNav";
import useEmblaCarousel from "embla-carousel-react";
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

  const SLIDE_COUNT = 5;
  const slides = Array.from(Array(SLIDE_COUNT).keys());
  return (
    <div>
      <SideNav click={closeNav} state={state} />
      <div
        className={`bg-gray-200 top-0 right-0 w-full h-full -z-100 ${
          state ? "fixed" : "static"
        }`}
      >
        {/* Header */}
        <Header click={openNav} />
        <div className="bg-white">
          <h1 className="font-semibold text-xl p-2">Mis acciones</h1>
          <EmblaCarousel acciones={entriesData} />
        </div>
      </div>
      {/* <div className="flex flex-col items-center p-5">
        <h1 className="mb-10 text-2xl font-bold">Mis acciones</h1>
        <div className="w-[80%] bg-blue-200 flex justify-between px-5 py-2 rounded-lg">
          <div>
            <h1 className="headerTable">Acción</h1>
            {entriesData.map((acciones) => (
              <p key={acciones.id}>{acciones.id}</p>
            ))}
          </div>
          <div>
            <h1 className="headerTable">Valor</h1>
            {entriesData.map((acciones) => (
              <CurrencyFormat
                key={acciones.id}
                value={acciones.valor}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
                renderText={(value) => <p>{value}</p>}
              />
            ))}
          </div>
          <div>
            <h1 className="headerTable">Cantidad</h1>
            {entriesData.map((acciones) => (
              <p key={acciones.id}>{acciones.cantidad}</p>
            ))}
          </div>
          <div>
            <h1 className="headerTable">Última fecha de compra</h1>
            {entriesData.map((acciones) => (
              <p key={acciones.id}>{acciones.fecha}</p>
            ))}
          </div>
          <div>
            <h1 className="headerTable">Tipo de cambio</h1>
            {entriesData.map((acciones) => (
              <CurrencyFormat
                key={acciones.id}
                value={acciones.cambio}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
                renderText={(value) => <p>{value}</p>}
              />
            ))}
          </div>
          <div>
            <h1 className="headerTable">Comisión</h1>
            {entriesData.map((acciones) => (
              <p key={acciones.id}>{acciones.comision}%</p>
            ))}
          </div>
          <div>
            <h1 className="headerTable">Total</h1>
            {entriesData.map((acciones) => (
              <CurrencyFormat
                key={acciones.id}
                value={acciones.total}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
                renderText={(value) => <p>{value}</p>}
              />
            ))}
          </div>
        </div>
      </div> */}
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
