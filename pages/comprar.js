import React, { useState } from "react";
import Header from "../components/Header";
import { getSession, useSession } from "next-auth/react";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import Swal from "sweetalert2";
import CurrencyFormat from "react-currency-format";
import SideNav from "../components/SideNav";

function Comprar() {
  const { data: session } = useSession();

  //#region variables acciones
  const [accionID, setAccion] = useState(0);
  const [nombre, setNombre] = useState("");
  const [valor, setValor] = useState("");
  const [cambio, setCambio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [comision, setComision] = useState("");
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

  //#region comprarAccion
  async function comprarAccion() {
    const docRef = doc(db, "users", session.user.email, "stocks", accionID);
    const docSnap = await getDoc(docRef);

    var accion = {};

    if (docSnap.exists()) {
      accion = {
        accionID,
        nombre,
        valor:
          (parseFloat(valor.replaceAll(",", "").replace("$", "")) *
            parseInt(cantidad) +
            docSnap.data().total) /
          (parseInt(cantidad) + docSnap.data().cantidad),
        cambio: parseFloat(cambio.replace("$", "")),
        cantidad: parseInt(cantidad) + docSnap.data().cantidad,
        comision: parseFloat(comision),
        fecha,
        urlImg,
        total:
          valor.replaceAll(",", "").replace("$", "") * parseInt(cantidad) +
          docSnap.data().total,
      };
    } else {
      accion = {
        accionID,
        nombre,
        valor: parseFloat(valor.replaceAll(",", "").replace("$", "")),
        cambio: parseFloat(cambio),
        cantidad: parseInt(cantidad),
        comision: parseFloat(comision),
        fecha,
        urlImg,
        total: valor.replaceAll(",", "").replace("$", "") * cantidad,
      };
    }

    await setDoc(
      doc(db, "users", session.user.email, "stocks", accionID),
      accion
    ).then(
      Swal.fire({
        icon: "success",
        title: "¡Compra exitosa!",
        showConfirmButton: false,
        timer: 1500,
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
        monto: valor.replaceAll(",", "").replace("$", "") * parseInt(cantidad),
        fecha,
        cantidad: parseInt(cantidad),
      }
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
                setValor(e.target.value);
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
                setCantidad(e.target.value.replace(/\D/g, ""));
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              type="text"
              placeholder="Número de acciones"
            />
          </div>

          {/* Comisión */}
          <div className="text-sm mt-3">
            <CurrencyFormat
              value={comision}
              onChange={(e) => {
                setComision(e.target.value);
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              placeholder="Comisión de la acción"
              allowNegative={true}
              suffix={"%"}
            />
          </div>

          {/* Tipo de cambio */}
          <div className="text-sm mt-3">
            <CurrencyFormat
              value={cambio}
              onChange={(e) => {
                setCambio(e.target.value);
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

          {/* Botón comprar  */}
          <div className="flex justify-center mt-6">
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
          </div>
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
