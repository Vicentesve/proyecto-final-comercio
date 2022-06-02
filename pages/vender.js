import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getSession, useSession } from "next-auth/react";
import React, { useState } from "react";
import CurrencyFormat from "react-currency-format";
import Swal from "sweetalert2";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import Ticket from "../components/Ticket";
import { db } from "../firebase/initFirebase";
import funcionesPDF from "./../functions/setCartaConfirmacion";

function Vender({ entriesData }) {
  const { data: session } = useSession();
  const { setCarta } = funcionesPDF();

  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);

  //#region useStates
  const [acciones, setAcciones] = useState(entriesData);
  const [accionID, setAccion] = useState(0);
  const [cantVender, setCantVender] = useState();
  const [valorVender, setValorVender] = useState();
  //#endregion

  //#region variables sideNav
  const [state, setNavOpen] = useState(false);

  const openNav = () => {
    setNavOpen(true);
  };
  const closeNav = () => {
    setNavOpen(false);
  };
  //#endregion

  //#region venderAcciones
  async function venderAcciones() {
    let valor, cantidad, fecha, cambio, comision, total, iva, nombre, urlImg;
    acciones.map((accion) => {
      if (accion.id === accionID) {
        cantidad = accion.cantidad;
        valor = accion.valor;
        fecha = accion.fecha;
        cambio = accion.cambio;
        comision = accion.comision;
        total = accion.total;
        nombre = accion.nombre;
        urlImg = accion.urlImg;
        iva = accion.iva;
      }
    });

    let pTotal = valorVender * cantVender;
    let pComision = (pTotal / 100) * 1;
    let pIVA = (pComision / 100) * 16;
    let pTotalFinal = pTotal - pComision - pIVA;

    let pTotalStock = (cantidad - cantVender) * valor;
    let pComisionStock = (pTotalStock / 100) * 1;
    let pIVAStock = (pComisionStock / 100) * 16;
    let pTotalFinalStock = pTotalStock - pComisionStock - pIVAStock;

    let table = {
      "Tipo de operación": "Venta de acciones",
      Instrumento: "MXN/USD",
      Mercado: "Capitales",
      Portafolio: "Simply Wallet St",
      Contraparte: nombre.toString(),
      "Buy/Sell": "Sell",
      "Fecha de ejecución": fecha,
      Cantidad: cantVender,
      "Precio acordado": numberFormat.format(valorVender),
      "Tipo de cambio": numberFormat.format(cambio),
      Comisión: `${comision}%`,
      IVA: `${iva}%`,
    };

    if (cantVender > cantidad) {
      Swal.fire({
        icon: "warning",
        title: "No puedes vender mas acciones de las que tienes",
      });
      return;
    } else if (cantVender == cantidad) {
      await deleteDoc(doc(db, "users", session.user.email, "stocks", accionID));
      Swal.fire({
        icon: "success",
        title: "Venta exitosa!",
        text: "¿Quieres generar tu carta de confirmación?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, generar",
        cancelButtonText: "No (la podrás generar despues)",
      }).then((result) => {
        if (result.isConfirmed) {
          setCarta(session.user.name, "Venta de acciones", table);
        }
      });
    } else {
      const accion = {
        accionID,
        cambio,
        cantidad: cantidad - cantVender,
        comision,
        iva,
        fecha,
        nombre,
        total: pTotalFinalStock,
        urlImg,
        valor,
      };

      await setDoc(
        doc(db, "users", session.user.email, "stocks", accionID),
        accion
      ).then(
        Swal.fire({
          icon: "success",
          title: "¡Compra exitosa!",
          text: "¿Quieres generar tu carta de confirmación?",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, generar",
          cancelButtonText: "No (la podrás generar despues)",
        }).then((result) => {
          if (result.isConfirmed) {
            setCarta(session.user.name, "Venta de acciones", table);
          }
        })
      );

      setValorVender("");
      setCantVender("");
    }

    const querySnapshot = await getDocs(
      collection(db, "users", session.user.email, "stocks")
    );
    const entriesData = querySnapshot.docs.map((entry) => ({
      id: entry.id,
      ...entry.data(),
    }));

    const q = query(
      collection(db, "users", session.user.email, "myWallet"),
      where("accionID", "==", accionID)
    );

    const queryWallet = await getDocs(q);
    const myWallet = queryWallet.docs.map((entry) => ({
      ...entry.data(),
    }));

    await setDoc(
      doc(
        db,
        "users",
        session.user.email,
        "myWallet",
        accionID + "_" + myWallet.length
      ),
      {
        accionID,
        tipo: "Venta",
        monto: pTotalFinal,
        fecha,
        cantidad: parseInt(cantVender),
      }
    );

    await setDoc(
      doc(
        db,
        "users",
        session.user.email,
        "letter_stocks",
        accionID + "_" + entriesData.length
      ),
      table
    );

    setAcciones(entriesData);
  }
  //#endregion

  return (
    <div>
      <SideNav click={closeNav} state={state} />
      <Header click={openNav} />
      <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
        {acciones.length ? "Vender acciones" : "No tienes acciones"}
      </h1>

      {acciones.length ? (
        <div className="p-4 sm:w-[60%] m-auto md:w-[50%] lg:w-[40%] xl:w-[30%]">
          <div className="m-auto border border-[#c7bbbb] shadow-lg rounded-lg p-2">
            {/* Seleccionar acción a comprar */}
            <div className="shadow-lg rounded-md">
              <select
                onChange={(e) => {
                  setAccion(e.target.value);
                }}
                className="w-full p-1 text-sm bg-gray-50 rounded-md"
              >
                {accionID === 0 ? (
                  <option value={0}>Selecciona la acción a vender</option>
                ) : (
                  <></>
                )}
                {acciones.map((accion, i) => (
                  <option key={i} value={accion.id}>
                    {accion.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {acciones.map((accion) => {
            if (accion.id === accionID) {
              return (
                <div key={accion.id} className="relative my-5">
                  <Ticket
                    id={accion.id}
                    nombre={accion.nombre}
                    fecha={accion.fecha}
                    cantidad={accion.cantidad}
                    valor={accion.valor}
                    comision={accion.comision}
                    total={accion.total}
                    urlImg={accion.urlImg}
                    iva={accion.iva}
                  />

                  {/* Valor de la accion */}
                  <div className="text-sm mt-5 flex flex-col space-y-1">
                    <h3>Ingresa el valor de la acción a vender</h3>
                    <CurrencyFormat
                      value={valorVender}
                      onChange={(e) => {
                        setValorVender(
                          e.target.value.replaceAll(",", "").replace("$", "")
                        );
                      }}
                      className="w-full border border-[#c7bbbb] rounded-md p-1"
                      thousandSeparator={true}
                      placeholder="Valor de la acción"
                      allowNegative={false}
                      prefix={"$"}
                    />
                  </div>
                  {/* Cantidad */}
                  <div className="text-sm mt-3 flex flex-col space-y-1">
                    <h3>Ingresa la catidad de acciones a vender</h3>
                    <input
                      value={cantVender}
                      onChange={(e) => {
                        setCantVender(e.target.value.replace(/\D/g, ""));
                      }}
                      className="w-full border border-[#c7bbbb] rounded-md p-1"
                      type="text"
                      placeholder="Número de acciones"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={venderAcciones}
                      className="mt-10 button block"
                    >
                      Vender
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <img
          className="object-contain sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] m-auto"
          src="noStock.jpg"
          alt=""
        />
      )}
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
