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
import { db } from "../firebase/initFirebase";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TicketFuturo from "./../components/TicketFuturo";
import funcionesPDF from "./../functions/setCartaConfirmacion";

function VenderFuturo({ entriesData }) {
  const { data: session } = useSession();

  //#region useStates
  const [futuros, setFuturos] = useState(entriesData);
  const [futuroID, setFuturoID] = useState(0);
  const [tarifa, setTarifa] = useState();
  const [inversion, setInversion] = useState();
  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);
  const { setCarta } = funcionesPDF();

  //#endregion

  //#region Vender futuro
  async function venderFuturo() {
    await deleteDoc(doc(db, "users", session.user.email, "futuros", futuroID));

    const querySnapshot = await getDocs(
      collection(db, "users", session.user.email, "futuros")
    );
    const entriesData = querySnapshot.docs.map((entry) => ({
      id: entry.id,
      ...entry.data(),
    }));

    setFuturos(entriesData);

    const docRef = doc(
      db,
      "users",
      session.user.email,
      "walletFuturos",
      futuroID
    );
    const docSnap = await getDoc(docRef);

    let precio_venta = tarifa;

    let ganancia =
      (precio_venta - docSnap.data().tarifa) * docSnap.data().unidad;

    let table = {
      "Tipo de operación": "Venta de futuros",
      Instrumento: "MXN/USD",
      Mercado: "Derivados",
      Portafolio: "Simply Wallet St",
      Compra: docSnap.data().nombre,
      "Buy/Sell": "Sell",
      "Fecha de ejecución": docSnap.data().fecha,
      "Tarifa contratada": numberFormat.format(tarifa),
      Inversión: numberFormat.format(docSnap.data().inversion),
      Plazo: `${docSnap.data().plazo} meses`,
      Unidad: numberFormat.format(docSnap.data().unidad),
      "Precio de venta": numberFormat.format(precio_venta),
      Ganancia: numberFormat.format(ganancia),
    };

    await setDoc(
      doc(db, "users", session.user.email, "walletFuturos", futuroID),
      {
        id: futuroID,
        fecha: docSnap.data().fecha,
        fecha_vencimiento: docSnap.data().fecha_vencimiento,
        plazo: docSnap.data().plazo,
        nombre: docSnap.data().nombre,
        tarifa: docSnap.data().tarifa,
        inversion: docSnap.data().inversion,
        unidad: docSnap.data().unidad,
        precio_venta,
        ganancia,
      }
    ).then(
      Swal.fire({
        icon: "success",
        title: "Venta del futuro exitosa!",
        text: "¿Quieres generar tu carta de confirmación?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, generar",
        cancelButtonText: "No (la podrás generar despues)",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setCarta(session.user.name, "Venta de futuros", table);
        }

        await setDoc(
          doc(
            db,
            "users",
            session.user.email,
            "letter_futuros",
            `${docSnap.data().id}_venta`
          ),
          table
        );
      })
    );
  }
  //#endregion
  return (
    <div>
      <Header />
      <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
        {futuros.length ? "Vender futuros" : "No tienes futuros"}
      </h1>

      {futuros.length ? (
        <div className="p-4 sm:w-[60%] m-auto md:w-[50%] lg:w-[40%] xl:w-[30%]">
          <div className="m-auto border border-[#c7bbbb] shadow-lg rounded-lg p-2">
            {/* Seleccionar futuro a vender */}
            <div className="shadow-lg mt-2 rounded-md">
              <FormControl fullWidth size="small">
                <InputLabel>Seleccione el futuro a vender</InputLabel>
                <Select
                  onChange={(e) => {
                    setFuturoID(e.target.value);
                  }}
                  native
                  label="Seleccione el futuro a comprar"
                  defaultValue=""
                >
                  <option aria-label="None" value="" />
                  {futuros.map((futuro, i) => (
                    <>
                      <option key={i} value={futuro.id}>
                        {futuro.nombre}
                      </option>
                      <option className="italic text-xs font-semibold" disabled>
                        &nbsp;&nbsp;&nbsp;{`ID: #${futuro.id}`}
                      </option>
                    </>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          {futuros.map((futuro) => {
            if (futuro.id === futuroID) {
              return (
                <div key={futuro.id} className="relative my-5">
                  <TicketFuturo
                    key={futuro.id}
                    id={futuro.id}
                    nombre={futuro.nombre}
                    fecha={futuro.fecha}
                    inversion={futuro.inversion}
                    tarifa={futuro.tarifa}
                    plazo={futuro.plazo}
                    unidad={futuro.unidad}
                    urlImg={futuro.urlImg}
                  />

                  {/* Tarifa contratada */}
                  <div className="text-sm mt-3 ">
                    <CurrencyFormat
                      value={tarifa}
                      onChange={(e) => {
                        e.target.value !== ""
                          ? setTarifa(
                              parseFloat(
                                e.target.value
                                  .replaceAll(",", "")
                                  .replace("$", "")
                              )
                            )
                          : setTarifa(
                              e.target.value
                                .replaceAll(",", "")
                                .replace("$", "")
                            );
                      }}
                      className="w-full border border-[#c7bbbb] rounded-md p-1"
                      thousandSeparator={true}
                      placeholder="Tarifa contratada"
                      allowNegative={false}
                      prefix={"$"}
                    />
                  </div>

                  {/* Botón vender */}
                  <div className="flex justify-center">
                    <button
                      onClick={venderFuturo}
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
    collection(db, "users", session.user.email, "futuros")
  );
  const entriesData = querySnapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));

  return {
    props: { session, entriesData },
  };
}

export default VenderFuturo;
