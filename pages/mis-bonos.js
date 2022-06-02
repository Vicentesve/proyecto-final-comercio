import { getSession } from "next-auth/react";
import React, { useState } from "react";
import Header from "../components/Header";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/initFirebase";
import CurrencyFormat from "react-currency-format";
import { Popover } from "react-tiny-popover";
import { XIcon } from "@heroicons/react/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function MisBonos({ entriesData }) {
  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);

  const [isPopoverOpen, setIsPopoverOpen] = useState("");

  //Función para convertir objecto a arreglo
  function objectToArray(objOfObjs) {
    const bonos = [];
    Object.entries(objOfObjs).map((cupon) => {
      bonos.push(cupon[1]);
    });

    return bonos.sort(sort_by("no", false, parseInt));
  }

  //Función para ordenar los cupones
  const sort_by = (field, reverse, primer) => {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    };
  };

  //Función para cutomizar el tooltip
  const CustomTooltip = ({ active, payload, label, bonos }) => {
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
  return (
    <div>
      <Header />
      <div className="bg-white">
        <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
          {entriesData.length > 0 ? "Mis bonos" : "No tienes bonos"}
        </h1>

        <div className="border border-gray-400 rounded-md m-auto w-fit mt-5">
          <table className="m-auto table-auto">
            <thead>
              <tr>
                <th>ID</th>
                <th>Interés bruto</th>
                <th>Ganancia Total</th>
                <th>Cupones</th>
              </tr>
            </thead>
            <tbody>
              {entriesData.map((data, i) => (
                <tr key={i}>
                  <td>#{data.id}</td>
                  <td>
                    <CurrencyFormat
                      value={data.interes_bruto}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                      renderText={(value) => <p>{value}</p>}
                    />
                  </td>
                  <td>
                    <CurrencyFormat
                      value={data.ganancia_total}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                      renderText={(value) => <p>{value}</p>}
                    />
                  </td>
                  <td>
                    <Popover
                      isOpen={data.id == isPopoverOpen ? true : false}
                      onClickOutside={() => setIsPopoverOpen(false)}
                      content={
                        <div
                          className="w-fit h-fit bg-[#fff] rounded-md border border-gray-400 shadow-lg 
                            absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4"
                        >
                          <div className="flex justify-end p-1 cursor-pointer h-7">
                            <XIcon
                              onClick={() => setIsPopoverOpen("")}
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
                              data={objectToArray(data.cupones)}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip
                                content={
                                  <CustomTooltip
                                    bonos={objectToArray(data.cupones)}
                                  />
                                }
                              />
                              <Legend />
                              <Bar dataKey="Inversión" fill="#2B3EA7" />
                              <Bar dataKey="Rendimiento" fill="#16a34a" />
                            </BarChart>
                          </div>
                        </div>
                      }
                    >
                      <button
                        onClick={() => {
                          setIsPopoverOpen(data.id);
                        }}
                        className="bg-[#232F3E] hover:bg-[#3d5068] text-white font-semibold text-sm rounded-lg whitespace-nowrap p-1"
                      >
                        Ver cupones
                      </button>
                    </Popover>
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
    collection(db, "users", session.user.email, "bonos")
  );
  const entriesData = querySnapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));

  return {
    props: { session, entriesData },
  };
}

export default MisBonos;
