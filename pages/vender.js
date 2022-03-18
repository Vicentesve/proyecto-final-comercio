import { async } from "@firebase/util";
import { collection, getDocs } from "firebase/firestore";
import { getSession } from "next-auth/react";
import React, { useState } from "react";
import CurrencyFormat from "react-currency-format";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { db } from "../firebase/initFirebase";

function Vender({ entriesData }) {
  const [accionID, setAccion] = useState(0);
  const [cantVender, setCantVender] = useState();
  const [valorVender, setValorVender] = useState();

  async function venderAcciones() {
    let valor, cantidad, fecha, cambio, comision, total;
    entriesData.map((accion) => {
      if (accion.id === accionID) {
        cantidad = accion.cantidad;
      }
    });

    if (cantVender > cantidad) {
      Swal.fire({
        icon: "warning",
        title: "No puedes vender mas acciones de las que tienes",
      });
    } else {
      const accion = {
        accionID,
        valor,
      };
    }
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center p-5 ">
        <h1 className="mb-10 text-2xl font-bold">Venta de acciones</h1>

        <div className="flex space-x-5 w-full justify-center h-72">
          <div className=" bg-gray-100 rounded-xl w-[40%] flex flex-col items-center p-5 space-y-5">
            <h1 className="font-bold text-lg">Información de la acción</h1>
            <select
              value={accionID}
              onChange={(e) => {
                setAccion(e.target.value);
              }}
              className="rounded-sm text-sm p-1"
            >
              <option value={0}>Selecciona la acción a vender</option>
              {entriesData.map((accion) => (
                <option value={accion.id} key={accion.id}>
                  {accion.id}
                </option>
              ))}
            </select>

            {entriesData.map((accion) => {
              if (accion.id === accionID) {
                return (
                  <div key={accion.id} className="mt-5 ">
                    <div className="mb-2 justify-center flex">
                      <p className="font-bold text-lg">{accion.id}</p>
                    </div>

                    <div className="flex space-x-2">
                      <p className="font-semibold">Valor:</p>
                      <CurrencyFormat
                        value={accion.valor}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                        renderText={(value) => <p>{value}</p>}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <p className="font-semibold">Cantidad:</p>
                      <p>{accion.cantidad}</p>
                    </div>

                    <div className="flex space-x-2">
                      <p className="font-semibold">Última fecha de compra:</p>
                      <p>{accion.fecha}</p>
                    </div>

                    <div className="flex space-x-2">
                      <p className="font-semibold">Comisión:</p>
                      <p>{accion.comision}%</p>
                    </div>

                    <div className="flex space-x-2">
                      <p className="font-semibold">Total:</p>
                      <CurrencyFormat
                        value={accion.total}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                        renderText={(value) => <p>{value}</p>}
                      />
                    </div>
                  </div>
                );
              }
            })}
          </div>

          <div className=" bg-gray-100 rounded-xl w-[40%] flex flex-col items-center p-5 space-y-5">
            <h1 className="font-bold text-lg">
              Venta de la acción: {accionID != 0 ? accionID : ""}
            </h1>
            {accionID != 0 && (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full">
                  <p className="mb-2 font-semibold">
                    ¿Cuántas acciones quieres vender?
                  </p>
                  <input
                    value={cantVender}
                    onChange={(e) => {
                      setCantVender(e.currentTarget.value.replace(/\D/g, ""));
                    }}
                    className="w-full p-1 border-gray-500 text-sm"
                    type="text"
                  />
                </div>

                <div className="w-full">
                  <p className="mb-2 font-semibold">
                    Ingresa el valor de las acciones
                  </p>
                  <input
                    value={valorVender}
                    onChange={(e) => {
                      setValorVender(
                        e.currentTarget.value
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*?)\..*/g, "$1")
                      );
                    }}
                    className="w-full p-1 border-gray-500 text-sm"
                    type="text"
                  />
                </div>

                <button onClick={venderAcciones} className=" mt-14 button">
                  Vender
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vender;

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
