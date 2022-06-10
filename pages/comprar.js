import React, { useState } from "react";
import Header from "../components/Header";
import { getSession, useSession } from "next-auth/react";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import Swal from "sweetalert2";
import CurrencyFormat from "react-currency-format";
import SideNav from "../components/SideNav";
import funcionesPDF from "./../functions/setCartaConfirmacion";
import funcionesVar from "./../functions/var";
import { Popover } from "@mui/material";
import { XIcon } from "@heroicons/react/outline";

function Comprar() {
  //#region Variables genrales
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: session } = useSession();
  const { setCarta } = funcionesPDF();
  const { generar_valor_de_riesgo } = funcionesVar();
  const [riskValue, setRiskValue] = useState([]);

  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);
  //#endregion

  //#region variables acciones
  const [accionID, setAccion] = useState(0);
  const [nombre, setNombre] = useState("");
  const [valor, setValor] = useState("");
  const [cambio, setCambio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [comision, setComision] = useState("");
  const [iva, setIVA] = useState(16);
  const [urlImg, setUrlImg] = useState("");
  const [fecha, setFecha] = useState();
  //#endregion

  //#region acciones
  let acciones = [
    {
      id: "TSLA",
      nombre: "Tesla, Inc",
      urlImg: "http://pngimg.com/uploads/tesla_logo/tesla_logo_PNG21.png",
    },
    {
      id: "AMZN",
      nombre: "Amazon.com, Inc",
      urlImg:
        "https://images-na.ssl-images-amazon.com/images/I/31%2BDgxPWXtL.jpg",
    },
    {
      id: "DIS",
      nombre: "The Walt Disney Company",
      urlImg:
        "https://graffica.info/wp-content/uploads/2018/11/disneyplus-1024x577.jpg",
    },
    {
      id: "NFLX",
      nombre: "Netflix",
      urlImg:
        "https://1000marcas.net/wp-content/uploads/2020/01/Logo-Netflix.png",
    },
    {
      id: "RUN",
      nombre: "SunRun",
      urlImg:
        "https://1000marcas.net/wp-content/uploads/2021/05/Sunrun-Logo-2016.png",
    },
    {
      id: "WMT",
      nombre: "Walmart",
      urlImg: "https://cdn.mos.cms.futurecdn.net/5StAbRHLA4ZdyzQZVivm2c.jpg",
    },
  ];
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

  //#region Total a pagar
  function totalPagar() {
    let pTotal = valor * cantidad;
    let pComision = (pTotal / 100) * comision;
    let pIVA = (pComision / 100) * iva;
    let pTotalFinal = pTotal + pComision + pIVA;

    return pTotalFinal;
  }
  //#endregion

  //#region comprarAccion
  async function comprarAccion() {
    const docRef = doc(db, "users", session.user.email, "stocks", accionID);
    const docSnap = await getDoc(docRef);

    let table = {
      "Tipo de operación": "Compra de acciones",
      Instrumento: "MXN/USD",
      Mercado: "Capitales",
      Portafolio: "Simply Wallet St",
      Contraparte: nombre.toString(),
      "Buy/Sell": "Buy",
      "Fecha de ejecución": fecha,
      Cantidad: cantidad,
      "Precio acordado": numberFormat.format(valor),
      "Tipo de cambio": numberFormat.format(cambio),
      Comisión: `${comision}%`,
      IVA: `${iva}%`,
    };
    let accion = {};
    let pTotal = valor * cantidad;
    let pComision = (pTotal / 100) * comision;
    let pIVA = (pComision / 100) * iva;
    let pTotalFinal = pTotal + pComision + pIVA;

    if (docSnap.exists()) {
      accion = {
        accionID,
        nombre,
        valor:
          (pTotalFinal + docSnap.data().total) /
          (cantidad + docSnap.data().cantidad),
        cambio,
        cantidad: cantidad + docSnap.data().cantidad,
        comision,
        iva,
        fecha,
        urlImg,
        total: pTotalFinal + docSnap.data().total,
      };
    } else {
      accion = {
        accionID,
        nombre,
        valor,
        cambio,
        cantidad,
        comision,
        iva,
        fecha,
        urlImg,
        total: pTotalFinal,
      };
    }

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
          setCarta(session.user.name, "Compra de acciones", table);
        }
      })
    );

    const q = query(
      collection(db, "users", session.user.email, "myWallet"),
      where("accionID", "==", accionID)
    );

    const querySnapshot = await getDocs(q);
    const entriesData = querySnapshot.docs.map((entry) => ({
      ...entry.data(),
    }));

    await setDoc(
      doc(
        db,
        "users",
        session.user.email,
        "myWallet",
        accionID + "_" + entriesData.length
      ),
      {
        accionID,
        tipo: "Compra",
        monto: pTotalFinal,
        fecha,
        cantidad,
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
  }
  //#endregion

  //#region validations
  function validations() {
    if (accionID === 0) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona la acción a comprar",
      });
      return false;
    } else if (valor.length == 0) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa el valor de la acción",
      });
      return false;
    } else if (cantidad.length == 0) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa la cantidad de acciones",
      });
      return false;
    } else if (comision.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa la comisión",
      });
      return false;
    } else if (cambio.length == 0) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa el tipo de cambio ",
      });
      return false;
    } else if (fecha === undefined) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa la fecha de la compra",
      });
      return false;
    }
    return true;
  }
  //#endregion

  return (
    <div>
      {/* Background opacity */}
      <div
        className={`bg-black_rgba absolute w-full h-screen ${
          !isPopoverOpen ? "hidden" : ""
        }`}
      ></div>

      <SideNav click={closeNav} state={state} />
      <Header click={openNav} />
      <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
        Comprar acciones
      </h1>
      <div className="p-4 sm:w-[60%] m-auto md:w-[50%] lg:w-[40%] xl:w-[30%]">
        <div className="border border-[#c7bbbb] shadow-lg rounded-lg p-2">
          {/* Seleccionar acción a comprar */}
          <div className="shadow-lg  rounded-md">
            <select
              onChange={(e) => {
                setAccion(e.target.value);
                acciones.map((accion) => {
                  if (e.target.value == accion.id) {
                    setUrlImg(accion.urlImg);
                    setNombre(accion.nombre);
                  }
                });
              }}
              className="w-full p-1 text-sm bg-gray-50 rounded-md"
            >
              {accionID === 0 ? (
                <option value={0}>Selecciona la acción a comprar</option>
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

          {/* Image Stock */}
          <div className="mt-3">
            {acciones.map((accion) => {
              if (accionID == accion.id) {
                return (
                  <img
                    key={accion.id}
                    className=" object-cover w-full h-[120px] rounded-md"
                    src={accion.urlImg}
                    alt=""
                    loading="lazy"
                  />
                );
              }
            })}
          </div>

          {/* Valor de la accion */}
          <div className="text-sm mt-3 ">
            <CurrencyFormat
              value={valor}
              onChange={(e) => {
                e.target.value !== ""
                  ? setValor(
                      parseFloat(
                        e.target.value.replaceAll(",", "").replace("$", "")
                      )
                    )
                  : setValor(
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
          <div className="text-sm mt-3">
            <input
              value={cantidad}
              onChange={(e) => {
                setCantidad(parseInt(e.target.value.replace(/\D/g, "")));
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              type="number"
              placeholder="Número de acciones"
            />
          </div>

          {/* Comisión */}
          <div className="text-sm mt-3">
            <CurrencyFormat
              value={comision}
              onChange={(e) => {
                e.target.value !== ""
                  ? setComision(parseFloat(e.target.value.replace("%", "")))
                  : setComision(e.target.value.replace("%", ""));
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              placeholder="Comisión de la acción"
              allowNegative={true}
              suffix={"%"}
            />
          </div>

          {/* IVA */}
          <div className="text-sm mt-3">
            <CurrencyFormat
              value={iva}
              onChange={(e) => {
                e.target.value !== ""
                  ? setIVA(parseFloat(e.target.value.replace("%", "")))
                  : setIVA(e.target.value.replace("%", ""));
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              placeholder="IVA"
              allowNegative={true}
              suffix={"%"}
            />
          </div>

          {/* Tipo de cambio */}
          <div className="text-sm mt-3">
            <CurrencyFormat
              value={cambio}
              onChange={(e) => {
                e.target.value !== ""
                  ? setCambio(
                      parseFloat(
                        e.target.value.replaceAll(",", "").replace("$", "")
                      )
                    )
                  : setCambio(
                      e.target.value.replaceAll(",", "").replace("$", "")
                    );
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              placeholder="Tipo de cambio"
              allowNegative={false}
              prefix={"$"}
            />
          </div>

          {/* Fecha */}
          <div className="text-sm mt-3 flex items-center space-x-1 border border-[#c7bbbb] rounded-md p-1">
            <p className="whitespace-nowrap text-sm font-semibold">
              Fecha de compra:
            </p>
            <input
              className="w-full"
              type="date"
              onChange={(e) => {
                setFecha(e.target.value);
              }}
            />
          </div>

          <CurrencyFormat
            className="text-sm"
            value={totalPagar()}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            renderText={(value) => (
              <p className="mt-3 text-center">{`Total a pagar: ${value}`}</p>
            )}
            decimalScale={2}
          />

          {/* Botón comprar  */}
          <div className="flex justify-center mt-6 space-x-5">
            <button
              onClick={() => {
                if (!validations()) {
                  return;
                }
                comprarAccion();
                setValor("");
                setCambio("");
                setCantidad("");
                setComision("");
              }}
              className="button"
            >
              Comprar
            </button>

            {/* Calcular */}
            <button
              onClick={() => {
                setRiskValue(
                  generar_valor_de_riesgo(accionID, valor, cantidad)
                );
                setIsPopoverOpen(!isPopoverOpen);
              }}
              className="button"
            >
              VAR
            </button>
          </div>
        </div>
      </div>

      {/* Popup */}
      <div
        className={`p-2 absolute h-[80%] bg-white w-[40%] top-[50%] left-[50%] 
        transform -translate-x-[50%] -translate-y-1/2 border border-gray-400 shadow-md rounded-md overflow-y-scroll
        ${isPopoverOpen ? "block" : "hidden"}`}
      >
        {/* Close */}
        <div className="">
          <div className="flex justify-end p-1 cursor-pointer h-7 ">
            <XIcon
              onClick={() => setIsPopoverOpen(false)}
              className="h-full hover:opacity-70"
            />
          </div>
          <h1 className="font-semibold text-xl text-center">Valor de riesgo</h1>
          <table className="w-full ">
            <thead>
              <tr className="text-left">
                <th>Indíce</th>
                <th>P&L</th>
                <th>Probalidad</th>
              </tr>
            </thead>
            <tbody>
              {riskValue.map((value, i) => (
                <tr
                  className={`text-sm  ${value.var ? " bg-yellow-300" : ""}`}
                  key={i}
                >
                  <td>{value.index}</td>
                  <td>
                    <CurrencyFormat
                      value={value.p_l_manana}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                      decimalScale={2}
                      renderText={(value) => <p>{value}</p>}
                    />
                  </td>
                  <td>
                    <CurrencyFormat
                      value={value.prob * 100}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={"%"}
                      decimalScale={3}
                      renderText={(value) => <p>{value}</p>}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Comprar;

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

  return {
    props: { session },
  };
}
