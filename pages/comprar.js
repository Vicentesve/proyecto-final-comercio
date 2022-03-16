import React, { useState } from "react";
import Header from "../components/Header";

function Comprar() {
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

  const comprarAccion = () => {
    const accion = {
      accionID,
      valor,
      cambio,
      cantidad,
      comision,
      fecha,
    };
    console.log(accion);
  };

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
                setValor(e.currentTarget.value);
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
                setCambio(e.target.value);
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
                setCantidad(e.target.value);
              }}
              className="w-[70%] border border-gray-500 text-sm"
            />
          </div>

          <div className="divComprar">
            <p className="w-[30%] ">Comisión: </p>
            <input
              type="text"
              value={comision}
              onChange={(e) => {
                setComision(e.target.value);
              }}
              className="w-[70%] border border-gray-500 text-sm"
            />
          </div>

          <div className="divComprar">
            <p className="w-[30%]">Fecha:</p>
            <input
              className="w-[70%]"
              type="date"
              defaultValue={defaultValue}
              onChange={(e) => {
                setFecha(e.target.value);
              }}
            />
          </div>

          <button
            onClick={() => {
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
