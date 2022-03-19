import React, { useEffect, useRef, useState } from "react";
import CurrencyFormat from "react-currency-format";

function Ticket({
  id,
  nombre,
  fecha,
  cantidad,
  valor,
  comision,
  total,
  urlImg,
}) {
  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);

  /*  returnDiv(){
    return (
      <div className="relative z-100 -top-[90px] left-[25px] text-sm text-gray-600 w-full">
        {Array.from({ length: ref.current.offsetWidth / 3.5 }, (_, i) => ".")}
      </div>
    );
  } */

  return (
    <div ref={componentRef} className="w-full">
      <div className="w-full">
        <div className="h-96 border border-[#c7bbbb] shadow-lg rounded-lg">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="p-4">
                <h1 className="font-semibold">{nombre}</h1>
                <p className="text-sm">{id}</p>
              </div>

              <div className="h-[150px]">
                <img
                  className="w-full h-full object-cover"
                  src={urlImg}
                  alt=""
                />
              </div>

              <div className="flex justify-between p-4">
                <div>
                  <p className="font-semibold text-sm">Fecha</p>
                  <p className="text-sm">{fecha}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Cantidad</p>
                  <p className="text-sm">{cantidad}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Comisión</p>
                  <p className="text-sm">{comision}%</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Valor</p>
                  <CurrencyFormat
                    className="text-sm"
                    value={valor}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    renderText={(value) => <p>{value}</p>}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <img className="h-[70px]" src="/codeBars.png" alt="" />
              <div className="mr-5">
                <p className="font-semibold">Total</p>
                <CurrencyFormat
                  className="text-sm"
                  value={total}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                  renderText={(value) => <p>{value}</p>}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" bg-white border-l border-[#c7bbbb] w-8 rounded-full h-8  absolute top-[295px] -right-5 z-80"></div>
      <div className="absolute z-100 top-[295px] left-[25px] text-sm text-gray-600 overflow-hidden">
        {Array.from({ length: width / 3.5 }, (_, i) => ".")}
      </div>
      <div className=" bg-white border-r border-[#c7bbbb] w-8 rounded-full h-8  absolute top-[295px] -left-5 z-80"></div>
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
