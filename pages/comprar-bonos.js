import React, { useState } from "react";
import CurrencyFormat from "react-currency-format";
import Header from "../components/Header";
import { Popover } from "react-tiny-popover";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { XIcon } from "@heroicons/react/outline";
import Swal from "sweetalert2";
import { db } from "../firebase/initFirebase";
import { setDoc, doc } from "firebase/firestore";
import { getSession, useSession } from "next-auth/react";
import funcionesPDF from "./../functions/setCartaConfirmacion";

function ComprarBonos() {
  const { data: session } = useSession();
  const { setCarta } = funcionesPDF();

  const [bonos, setBonus] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [monto, setMonto] = useState("");
  const [plazo, setPlazo] = useState(0);

  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);

  //Function para calcular la inversión de los bonos
  function createData() {
    let cupones = plazo * 2;
    setBonus([]);
    for (let i = 1; i <= cupones; i++) {
      let tasa = genRand(6.4, 7, 3);
      let interes = monto * (tasa / 100);
      let isr = 0.16 * interes;
      let rendimiento = interes - isr;
      let data = {
        no: i,
        name: `Cupón ${i}`,
        Inversión: monto,
        Tasa: tasa,
        isr,
        interes,
        Rendimiento: rendimiento,
      };

      setBonus((prevValue) => [...prevValue, data]);
    }
  }

  //Función para sumar los intereses
  const sumInteres = () => {
    const interes = bonos.reduce((accumulator, object) => {
      return accumulator + object.interes;
    }, 0);

    return interes;
  };

  //Función para generar la tasa random
  function genRand(min, max, decimalPlaces) {
    var rand = Math.random() * (max - min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  }

  //Función para cutomizar el tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="text-sm bg-white border border-gray-200 rounded-md shadow-md p-3">
          {bonos.map((bono, i) => {
            if (label === bono.name) {
              return (
                <div key={i}>
                  <h1 className="text-lg font-semibold">{label}</h1>
                  <p>{`Inversión: ${numberFormat.format(bono.Inversión)} `}</p>
                  <p>{`Tasa: ${bono.Tasa}%`}</p>
                  <p>{`Interés: ${numberFormat.format(bono.interes)}`}</p>
                  <p>{`ISR: ${numberFormat.format(bono.isr)}`}</p>
                  <p>{`Rendimiento: ${numberFormat.format(
                    bono.Rendimiento
                  )}`}</p>
                </div>
              );
            }
          })}
        </div>
      );
    }

    return null;
  };

  //Función array to object
  const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

  //Función para validar los campos
  function validate() {
    if (plazo === 0) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona el plazo",
      });
      return false;
    } else if (monto < 100 || monto > 10000000) {
      Swal.fire({
        icon: "warning",
        title: "El monto debe ser entre 100 y 10,000,000",
      });
      return false;
    }

    return true;
  }

  //Función para comprar bonos
  async function comprarBonos() {
    var today = new Date();
    var fecha =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    let table = {
      "Tipo de operación": "Compra de bonos",
      Instrumento: "MXN/USD",
      Mercado: "Dinero",
      Portafolio: "Simply Wallet St",
      Contraparte: session.user.name,
      "Buy/Sell": "Buy",
      "Fecha de ejecución": fecha,
      "Inversión bonos": numberFormat.format(monto),
      "Interés bruto": numberFormat.format(sumInteres()),
      "Ganancia total": numberFormat.format(sumInteres() + monto),
    };

    let bonoComprado = {
      inversion: monto,
      interes_bruto: sumInteres(),
      ganancia_total: sumInteres() + monto,
      cupones: convertArrayToObject(bonos, "name"),
    };

    let id = (Date.now() + Math.random()).toString().replace(".", "");

    await setDoc(
      doc(db, "users", session.user.email, "bonos", id),
      bonoComprado
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
          setCarta(session.user.name, "Compra de bonos", table);
        }
      })
    );
  }

  return (
    <div>
      {/* Background opacity */}
      <div
        className={`bg-black_rgba absolute w-full h-screen ${
          !isPopoverOpen ? "hidden" : ""
        }`}
      ></div>

      <Header />

      <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
        Comprar bonos
      </h1>

      <div className="p-4 sm:w-[60%] m-auto md:w-[50%] lg:w-[40%] xl:w-[30%]">
        <div className="border border-[#c7bbbb] shadow-lg rounded-lg p-2">
          {/* Plazo */}
          <div className="shadow-lg  rounded-md">
            <select
              onChange={(e) => setPlazo(e.target.value)}
              className="w-full p-1 text-sm bg-gray-50 rounded-md"
              value={plazo}
            >
              {plazo === 0 ? (
                <option value={0}>Selecciona un plazo</option>
              ) : (
                <></>
              )}
              <option value={3}>3 años</option>
              <option value={5}>5 años</option>
              <option value={10}>10 años</option>
              <option value={20}>20 años</option>
              <option value={30}>30 años</option>
            </select>
          </div>
          {/* Monto */}
          <div className="text-sm mt-3 ">
            <CurrencyFormat
              value={monto}
              onChange={(e) => {
                e.target.value !== ""
                  ? setMonto(
                      parseFloat(
                        e.target.value.replaceAll(",", "").replace("$", "")
                      )
                    )
                  : setMonto(
                      e.target.value.replaceAll(",", "").replace("$", "")
                    );
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              thousandSeparator={true}
              placeholder="Monto"
              allowNegative={false}
              prefix={"$"}
            />
          </div>

          {/* Calculo BONOS */}
          <Popover
            isOpen={isPopoverOpen}
            onClickOutside={() => setIsPopoverOpen(false)}
            content={
              <div
                className=" w-fit h-fit bg-[#fff] rounded-md border border-gray-400 shadow-lg 
                            absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 "
              >
                <div className="flex justify-end p-1 cursor-pointer h-7">
                  <XIcon
                    onClick={() => setIsPopoverOpen(false)}
                    className="h-full hover:opacity-70"
                  />
                </div>
                <div className="p-5 flex flex-col items-center">
                  <h1 className="text-center text-lg font-semibold mb-5">
                    Inversión bonos
                  </h1>
                  <BarChart
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    width={700}
                    height={300}
                    data={bonos}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Inversión" fill="#2B3EA7" />
                    <Bar dataKey="Rendimiento" fill="#16a34a" />
                  </BarChart>
                </div>

                {/* Resultados finales */}
                <div className="text-center">
                  <h1>{`Inversión bonos: ${numberFormat.format(monto)}`}</h1>
                  <p>{`Interés bruto: ${numberFormat.format(sumInteres())}`}</p>
                  <p>
                    {`Ganancia total:`}{" "}
                    <span className=" font-semibold text-green-600">
                      {numberFormat.format(sumInteres() + monto)}
                    </span>
                  </p>
                </div>

                {/* Comprar */}
                <div
                  onClick={() => {
                    comprarBonos();
                  }}
                  className="flex justify-center my-6"
                >
                  <button className="button">Comprar</button>
                </div>
              </div>
            }
          >
            {/* Calcular */}
            <div
              onClick={() => {
                if (!validate()) return;
                createData();
                setIsPopoverOpen(true);
              }}
              className="flex justify-center mt-6"
            >
              <button className="button">Calcular</button>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default ComprarBonos;

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
