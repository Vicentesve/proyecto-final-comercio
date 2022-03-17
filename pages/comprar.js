import React, { useState } from "react";
import Header from "../components/Header";
import { getSession, useSession } from "next-auth/react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import Swal from "sweetalert2";
import CurrencyFormat from "react-currency-format";

function Comprar() {
  const { data: session } = useSession();

  const date = new Date();
  const futureDate = date.getDate();
  date.setDate(futureDate);
  const defaultValue = date.toLocaleDateString("en-CA");

  const [accionID, setAccion] = useState("TSLA");
  const [valor, setValor] = useState("");
  const [cambio, setCambio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [comision, setComision] = useState("");
  const [fecha, setFecha] = useState();

  let acciones = [
    { id: "TSLA", nombre: "Tesla, Inc" },
    { id: "AMZN", nombre: "Amazon" },
  ];

  async function comprarAccion() {
    const docRef = doc(db, "users", session.user.email, "stocks", accionID);
    const docSnap = await getDoc(docRef);

    var accion = {};

    if (docSnap.exists()) {
      accion = {
        accionID,
        valor:
          (parseFloat(valor) * parseInt(cantidad) + docSnap.data().total) /
          (parseInt(cantidad) + docSnap.data().cantidad),
        cambio: parseFloat(cambio),
        cantidad: parseInt(cantidad) + docSnap.data().cantidad,
        comision: parseFloat(comision),
        fecha,
        total: valor * parseInt(cantidad) + docSnap.data().total,
      };
    } else {
      accion = {
        accionID,
        valor: parseFloat(valor),
        cambio: parseFloat(cambio),
        cantidad: parseInt(cantidad),
        comision: parseFloat(comision),
        fecha,
        total: valor * cantidad,
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
  }

  function validations() {
    if (valor.length == 0) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa el valor de la acción",
      });
      return false;
    } else if (cambio.length == 0) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa el tipo de cambio ",
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
    } else if (fecha === undefined) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa la fecha de la compra",
      });
      return false;
    }
    return true;
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center p-5">
        <h1 className="mb-10 text-2xl font-bold">Compra de acciones</h1>
        <div className=" bg-gray-100 rounded-xl w-[30%] flex flex-col items-center p-5 space-y-5">
          <div className="divComprar">
            <p className="w-[30%]">Acción:</p>
            <select
              value={accionID}
              onChange={(e) => {
                setAccion(e.target.value);
              }}
              className="w-[70%]"
            >
              {acciones.map((accion, i) => (
                <option className="text-sm" key={i} value={accion.id}>
                  {accion.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="divComprar">
            <p className="w-[30%]">Valor:</p>
            <input
              value={valor}
              onChange={(e) => {
                setValor(
                  e.currentTarget.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*?)\..*/g, "$1")
                );
              }}
              type="text"
              className="w-[70%] border border-gray-500 text-sm"
            />
          </div>

          <div className="divComprar">
            <p className="w-[30%] ">Tipo de cambio: </p>
            <input
              value={cambio}
              onChange={(e) => {
                setCambio(
                  e.currentTarget.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*?)\..*/g, "$1")
                );
              }}
              type="text"
              className="w-[70%] border border-gray-500 text-sm"
            />
          </div>

          <div className="divComprar">
            <p className="w-[30%] ">Cantidad: </p>
            <input
              type="text"
              value={cantidad}
              onChange={(e) => {
                setCantidad(e.currentTarget.value.replace(/\D/g, ""));
              }}
              className="w-[70%] border border-gray-500 text-sm"
            />
          </div>

          <div className="divComprar">
            <p className="w-[30%] ">Comisión: </p>
            <CurrencyFormat
              className="w-[70%] border border-gray-500 text-sm"
              suffix={"%"}
              value={comision}
              onChange={(e) => {
                setComision(
                  e.target.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*?)\..*/g, "$1")
                );
              }}
            />
          </div>

          <div className="divComprar">
            <p className="w-[30%]">Fecha:</p>
            <input
              className="w-[70%]"
              type="date"
              defaultValue={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
              }}
            />
          </div>

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
