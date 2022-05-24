import React, { useEffect, useRef, useState } from "react";
import CurrencyFormat from "react-currency-format";

function Ticket({
  id,
  nombre,
  fecha,
  tarifa,
  inversion,
  plazo,
  ganancia,
  urlImg,
}) {
  const componentRef = useRef();
  var mydate = new Date(fecha);
  mydate.setMonth(mydate.getMonth() + plazo);
  var fecha_venciento = mydate.toISOString().split("T")[0];
  return (
    <div ref={componentRef} className="w-full">
      <div className="w-full">
        <div className="h-[420px] border border-[#c7bbbb] shadow-lg rounded-lg">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="p-4">
                <h1 className="font-semibold">{nombre}</h1>
                <p className="italic text-gray-500 text-xs">#{id}</p>
              </div>

              <div className="h-[150px]">
                <img
                  className="w-full h-full object-cover"
                  src={urlImg}
                  alt=""
                />
              </div>

              <div className="flex">
                <div className="flex justify-between p-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-sm">Fecha</p>
                    <p className="text-sm">{fecha}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Plazo</p>
                    <p className="text-sm">{plazo + " meses"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      Fecha de vencimiento
                    </p>
                    <p className="text-sm">{fecha_venciento}</p>
                  </div>
                </div>
                <div className="flex justify-between p-4 flex-wrap ">
                  <div>
                    <p className="font-semibold text-sm">Tarifa</p>
                    <CurrencyFormat
                      className="text-sm"
                      value={tarifa}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                      renderText={(value) => <p>{value}</p>}
                      decimalScale={2}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Inversion</p>
                    <CurrencyFormat
                      className="text-sm"
                      value={inversion}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                      renderText={(value) => <p>{value}</p>}
                      decimalScale={2}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <img className="h-[70px]" src="/codeBars.png" alt="" />
              <div className="mr-5">
                <p className="font-semibold">Ganancia contratada</p>
                <CurrencyFormat
                  className="text-sm"
                  value={ganancia}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                  decimalScale={2}
                  renderText={(value) => <p>{value}</p>}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" bg-white border-r-transparent border-l border-l-[#c7bbbb] w-8 rounded-full h-8  absolute top-[295px] -right-5 "></div>
      <div className=" bg-white border-l-transparent border-r border-r-[#c7bbbb] w-8 rounded-full h-8  absolute top-[295px] -left-5"></div>
    </div>
  );
}

export default Ticket;

export const useContainerDimensions = (myRef) => {
  const getDimensions = () => ({
    width: myRef.current.offsetWidth,
    height: myRef.current.offsetHeight,
  });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimensions;
};
