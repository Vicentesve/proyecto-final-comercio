import { getSession, useSession } from "next-auth/react";
import React, { useState } from "react";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CurrencyFormat from "react-currency-format";
import Swal from "sweetalert2";
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
import funcionesPDF from "./../functions/setCartaConfirmacion";

function ComprarFuturos() {
  const { data: session } = useSession();
  //#region variables sideNav
  const [state, setNavOpen] = useState(false);

  const openNav = () => {
    setNavOpen(true);
  };
  const closeNav = () => {
    setNavOpen(false);
  };
  //#endregion
  //#region variables acciones
  const [futuroID, setFuturo] = useState(0);
  const [nombre, setNombre] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [inversion, setInversion] = useState("");
  const [plazo, setPlazo] = useState("");
  const [urlImg, setUrlImg] = useState("");
  const [fecha, setFecha] = useState();
  const options = { style: "currency", currency: "USD" };
  const numberFormat = new Intl.NumberFormat("en-US", options);
  const { setCarta } = funcionesPDF();
  //#endregion
  //#region Futuros
  const futuros = [
    {
      id: 1,
      nombre: "Algodón",
      grupo: "agricolas",
      urlImg:
        "https://www.malabrigonoticias.com.ar/is-cnt/uploads/2021/08/algodon-4.jpg",
    },
    {
      id: 2,
      nombre: "Madera",
      grupo: "agricolas",
      urlImg:
        "https://www.caracteristicas.co/wp-content/uploads/2018/10/madera-4-e1580502519574.jpg",
    },
    {
      id: 3,
      nombre: "Maíz",
      grupo: "agricolas",
      urlImg:
        "https://www.caracteristicas.co/wp-content/uploads/2018/10/maiz-2-1-e1581908276964.jpg",
    },
    {
      id: 4,
      nombre: "Arroz",
      grupo: "agricolas",
      urlImg:
        "https://www.recetasnestle.com.co/sites/default/files/styles/crop_article_banner_desktop_oes/public/2021-09/arroz_0.jpg?itok=3mOKUSv9",
    },
    {
      id: 5,
      nombre: "Cacao",
      grupo: "agricolas",
      urlImg:
        "https://concepto.de/wp-content/uploads/2018/08/cacao-e1533849112880.jpg",
    },
    {
      id: 6,
      nombre: "Café",
      grupo: "agricolas",
      urlImg:
        "https://cafedelirante.com.ar/wp-content/uploads/2020/09/portada-granos-de-cafe-1-800x397.jpg",
    },
    {
      id: 7,
      nombre: "Azúcar",
      grupo: "agricolas",
      urlImg:
        "https://www.ecestaticos.com/imagestatic/clipping/91d/efc/91defc570fee4d52a8d39e173ff14965/tipos-de-azucar-diferencias-entre-la-glucosa-fructosa-y-sacarosa.jpg?mtime=1622813755",
    },
    {
      id: 8,
      nombre: "Ganado vivo",
      grupo: "agricolas",
      urlImg: "http://www.2000agro.com.mx/wp-content/uploads/n1_01_100621.jpg",
    },
    {
      id: 9,
      nombre: "Carnes",
      grupo: "agricolas",
      urlImg:
        "https://www.fundacionmaude.com/wp-content/uploads/2017/08/manipulacion_mataderos.jpg",
    },
    {
      id: 10,
      nombre: "Leche",
      grupo: "agricolas",
      urlImg:
        "http://c.files.bbci.co.uk/B4B5/production/_110216264_gettyimages-1089375390.jpg",
    },
    {
      id: 11,
      nombre: "Pieles",
      grupo: "agricolas",
      urlImg:
        "https://www.arteycuero.com/wp-content/uploads/2018/07/imagen-1-cuero-de-vaca.jpg",
    },
    {
      id: 12,
      nombre: "Aluminio",
      grupo: "metales",
      urlImg:
        "https://www.arqhys.com/wp-content/uploads/2017/06/Densidad-del-Aluminio.jpg",
    },
    {
      id: 13,
      nombre: "Cobre",
      grupo: "metales",
      urlImg:
        "https://www.worldenergytrade.com/images/stories/news/finanzas_energia/mercado/11502/el-precio-del-cobre-podria-duplicarse-hasta-los-20-000-dolares-por-tonelada-11502.jpg",
    },
    {
      id: 14,
      nombre: "Plomo",
      grupo: "metales",
      urlImg:
        "https://okdiario.com/img/2017/03/31/caracteristicas-del-plomo.jpg",
    },
    {
      id: 15,
      nombre: "Titanium",
      grupo: "metales",
      urlImg:
        "https://media.istockphoto.com/photos/titanium-metal-alloy-used-in-industry-super-resistant-metal-picture-id1300219293?s=170667a",
    },
    {
      id: 17,
      nombre: "Oro",
      grupo: "metales",
      urlImg: "https://s03.s3c.es/imag/_v0/770x420/8/3/7/Oro-mina.jpg",
    },
    {
      id: 18,
      nombre: "Plata",
      grupo: "metales",
      urlImg:
        "https://oroinformacion.com/wp-content/uploads/2019/09/Portada-1-lingotes-plata.jpg",
    },
    {
      id: 19,
      nombre: "Platino",
      grupo: "metales",
      urlImg:
        "https://oroinformacion.com/wp-content/uploads/2020/08/lingotes-de-platino.jpg",
    },
    {
      id: 20,
      nombre: "Paladio",
      grupo: "metales",
      urlImg: "https://i.blogs.es/2529f8/paladioap/1366_2000.jpg",
    },
    {
      id: 21,
      nombre: "Petróleo",
      grupo: "energia",
      urlImg:
        "https://i1.wp.com/www.oinkoink.com.mx/wp-content/uploads/2020/03/Precio-del-petroleo-mexicano.jpg?resize=1200%2C720&ssl=1",
    },
    {
      id: 22,
      nombre: "Gas",
      grupo: "energia",
      urlImg:
        "https://i0.wp.com/oilandgasmagazine.com.mx/wp-content/uploads/2019/05/GAS-LP.jpg",
    },
    {
      id: 23,
      nombre: "Gas natural",
      grupo: "energia",
      urlImg:
        "https://www.foronuclear.org/wp-content/uploads/2020/04/AdobeStock_248366964-854x465.jpeg",
    },
    {
      id: 24,
      nombre: "Carbón",
      grupo: "energia",
      urlImg:
        "https://www.worldenergytrade.com/images/stories/news/metales/mineria/12394/china-reiniciara-las-minas-de-carbon-provincias-del-norte-ante-el-aumento-demanda-de-energia-12394.jpg",
    },
    {
      id: 25,
      nombre: "Agua",
      grupo: "emergentes",
      urlImg: "https://www.iagua.es/sites/default/files/agua_28.jpg",
    },
    {
      id: 26,
      nombre: "Etanol",
      grupo: "emergentes",
      urlImg:
        "https://www.tietjen-original.com/wp-content/uploads/2021/01/xethanol-540x345px.jpg.pagespeed.ic.EhyTV267aP.jpg",
    },
  ];
  //#endregion
  //#region validations
  function validations() {
    if (futuroID === 0) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona el futuro a comprar",
      });
      return false;
    } else if (tarifa.length == 0) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa el valor de la tarifa",
      });
      return false;
    } else if (inversion.length == 0) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa el valor de la inversion",
      });
      return false;
    } else if (plazo.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Ingresa el plazo en meses",
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
  //#region ComprarFuturos
  async function comprarFuturo() {
    const q = query(
      collection(db, "users", session.user.email, "futuros"),
      where("futuroID", "==", futuroID)
    );

    const querySnapshot = await getDocs(q);
    const entriesData = querySnapshot.docs.map((entry) => ({
      ...entry.data(),
    }));

    let unidad = inversion / tarifa;
    let generateID = `${futuroID}${nombre.toUpperCase()}${
      entriesData.length
    }${new Date().getTime()}`.replace(/\s/g, "");

    let futuro = {
      id: generateID,
      nombre,
      tarifa,
      inversion,
      plazo,
      fecha,
      unidad,
      urlImg,
    };

    let table = {
      "Tipo de operación": "Compra de futuros",
      Instrumento: "MXN/USD",
      Mercado: "Derivados",
      Portafolio: "Simply Wallet St",
      Compra: nombre.toString(),
      "Buy/Sell": "Buy",
      "Fecha de ejecución": fecha,
      "Tarifa contratada": numberFormat.format(tarifa),
      Inversión: numberFormat.format(inversion),
      Plazo: `${plazo} meses`,
      Unidad: numberFormat.format(unidad),
    };

    await setDoc(
      doc(db, "users", session.user.email, "futuros", generateID),
      futuro
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
          setCarta(session.user.name, "Compra de futuros", table);
        }
      })
    );

    var mydate = new Date(fecha);
    mydate.setMonth(mydate.getMonth() + plazo);
    var fecha_vencimiento = mydate.toISOString().split("T")[0];

    let precio_venta = 0.0;
    await setDoc(
      doc(db, "users", session.user.email, "walletFuturos", generateID),
      {
        id: generateID,
        fecha,
        fecha_vencimiento,
        plazo,
        nombre,
        tarifa,
        inversion,
        unidad,
        precio_venta,
      }
    );

    await setDoc(
      doc(
        db,
        "users",
        session.user.email,
        "letter_futuros",
        `${generateID}_compra`
      ),
      table
    );
  }

  //#endregion
  return (
    <div>
      <SideNav click={closeNav} state={state} />
      <Header />

      <h1 className="font-semibold text-xl p-2 text-center mt-2 sm:text-2xl sm:font-bold">
        Comprar futuros
      </h1>

      <div className="p-4 sm:w-[60%] m-auto md:w-[50%] lg:w-[40%] xl:w-[30%]">
        <div className="border border-[#c7bbbb] shadow-lg rounded-lg p-2">
          {/* Seleccionar futuro a comprar */}
          <div className="shadow-lg mt-2 rounded-md">
            <FormControl fullWidth size="small">
              <InputLabel>Seleccione el futuro a comprar</InputLabel>
              <Select
                onChange={(e) => {
                  setFuturo(e.target.value);
                  futuros.map((futuro) => {
                    if (e.target.value == futuro.id) {
                      setUrlImg(futuro.urlImg);
                      setNombre(futuro.nombre);
                    }
                  });
                }}
                native
                label="Seleccione el futuro a comprar"
                defaultValue=""
              >
                <option aria-label="None" value="" />
                <optgroup label="Agricolas">
                  {futuros.map((futuro) => {
                    if (futuro.grupo === "agricolas") {
                      return <option value={futuro.id}>{futuro.nombre}</option>;
                    }
                  })}
                </optgroup>
                <optgroup label="Metales">
                  {futuros.map((futuro) => {
                    if (futuro.grupo === "metales") {
                      return <option value={futuro.id}>{futuro.nombre}</option>;
                    }
                  })}
                </optgroup>
                <optgroup label="Energía">
                  {futuros.map((futuro) => {
                    if (futuro.grupo === "energia") {
                      return <option value={futuro.id}>{futuro.nombre}</option>;
                    }
                  })}
                </optgroup>
                <optgroup label="Emergentes">
                  {futuros.map((futuro) => {
                    if (futuro.grupo === "emergentes") {
                      return <option value={futuro.id}>{futuro.nombre}</option>;
                    }
                  })}
                </optgroup>
              </Select>
            </FormControl>
          </div>

          {/* Image Stock */}
          <div className="mt-3">
            {futuros.map((futuro) => {
              if (futuroID == futuro.id) {
                return (
                  <img
                    key={futuro.id}
                    className=" object-cover w-full h-[120px] rounded-md"
                    src={futuro.urlImg}
                    alt=""
                    loading="lazy"
                  />
                );
              }
            })}
          </div>

          {/* Tarifa contratada */}
          <div className="text-sm mt-3 ">
            <CurrencyFormat
              value={tarifa}
              onChange={(e) => {
                e.target.value !== ""
                  ? setTarifa(
                      parseFloat(
                        e.target.value.replaceAll(",", "").replace("$", "")
                      )
                    )
                  : setTarifa(
                      e.target.value.replaceAll(",", "").replace("$", "")
                    );
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              thousandSeparator={true}
              placeholder="Tarifa contratada"
              allowNegative={false}
              prefix={"$"}
            />
          </div>

          {/* Inversión */}
          <div className="text-sm mt-3 ">
            <CurrencyFormat
              value={inversion}
              onChange={(e) => {
                e.target.value !== ""
                  ? setInversion(
                      parseFloat(
                        e.target.value.replaceAll(",", "").replace("$", "")
                      )
                    )
                  : setInversion(
                      e.target.value.replaceAll(",", "").replace("$", "")
                    );
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              thousandSeparator={true}
              placeholder="Inversión"
              allowNegative={false}
              prefix={"$"}
            />
          </div>

          {/* Plazo */}
          <div className="text-sm mt-3">
            <input
              value={plazo}
              onChange={(e) => {
                setPlazo(parseInt(e.target.value.replace(/\D/g, "")));
              }}
              className="w-full border border-[#c7bbbb] rounded-md p-1"
              type="number"
              placeholder="Plazo (meses)"
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

                comprarFuturo();
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

export default ComprarFuturos;
