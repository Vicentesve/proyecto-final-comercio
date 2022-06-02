import Header from "../components/Header";
import SideNav from "../components/SideNav";
import React, { useState } from "react";
import { getSession } from "next-auth/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import _ from "underscore";
import WalletCarousel from "../components/WalletCarousel";
import CurrencyFormat from "react-currency-format";

function MiCarteraFuturos({ walletDoc }) {
  console.log(walletDoc);
  return (
    <div>
      <Header />

      <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
        {walletDoc.length > 0 ? "Tu Cartera" : "Tu Cartera está vacia"}
      </h1>

      <div className="border border-gray-400 rounded-md m-auto w-fit mt-5">
        <table className="m-auto table-auto">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Plazo</th>
              <th>Fecha de vencimiento</th>
              <th>Inversión</th>
              <th>Unidad</th>
              <th>Tarifa contratada</th>
              <th>Tarifa vendida</th>
              <th>Ganancia</th>
            </tr>
          </thead>
          <tbody>
            {walletDoc.map((wallet, i) => (
              <tr key={i}>
                <td>{wallet.nombre}</td>
                <td>{wallet.fecha}</td>
                <td>
                  {wallet.plazo > 1
                    ? wallet.plazo + " meses"
                    : wallet.plazo + " mes"}
                </td>
                <td>{wallet.fecha_vencimiento}</td>

                <td>
                  <CurrencyFormat
                    value={wallet.inversion}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    renderText={(value) => <p>{value}</p>}
                  />
                </td>
                <td>
                  <CurrencyFormat
                    value={wallet.unidad}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    renderText={(value) => <p>{value}</p>}
                  />
                </td>
                <td>
                  <CurrencyFormat
                    value={wallet.tarifa}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    renderText={(value) => <p>{value}</p>}
                  />
                </td>
                <td>
                  {wallet.precio_venta === 0 ? (
                    "No se ha vendido"
                  ) : (
                    <CurrencyFormat
                      value={wallet.precio_venta}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                      renderText={(value) => <p>{value}</p>}
                    />
                  )}
                </td>
                <td>
                  <CurrencyFormat
                    value={wallet.ganancia}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    decimalScale={2}
                    renderText={(value) => (
                      <p
                        className={`font-semibold ${
                          wallet.ganancia < 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {value}
                      </p>
                    )}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

  const q = query(collection(db, "users", session.user.email, "walletFuturos"));

  const walletSnapshot = await getDocs(q);
  const walletDoc = walletSnapshot.docs.map((entry) => ({
    ...entry.data(),
  }));

  return {
    props: { session, walletDoc },
  };
}

export default MiCarteraFuturos;
