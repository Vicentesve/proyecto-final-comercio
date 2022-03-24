import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton } from "./EmblaCarouselButtons";
import { ShoppingBagIcon, ReceiptRefundIcon } from "@heroicons/react/outline";
import CurrencyFormat from "react-currency-format";

function WalletCarousel({ myWallet, entriesData }) {
  //#region Configuration Embla
  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const scrollTo = useCallback(
    (index) => embla && embla.scrollTo(index),
    [embla]
  );

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, setScrollSnaps, onSelect]);
  //#endregion

  //#region getGanancias
  function getGanacias(pAccionID) {
    let ganacias = 0;
    Object.entries(myWallet).map(([key, value]) => {
      if (key === pAccionID) {
        value.map((wallet) => {
          if (wallet.tipo == "Venta") {
            ganacias += wallet.monto;
          } else {
            ganacias -= wallet.monto;
          }
        });
      }
    });

    return (
      <CurrencyFormat
        value={ganacias}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
        renderText={(value) => (
          <p
            className={`mt-5 font-semibold text-right ${
              ganacias < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            Ganancia: {value}
          </p>
        )}
      />
    );
  }
  //#endregion

  return (
    <div>
      <div className="embla shadow-sm">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            {Object.entries(myWallet).map(([key, value]) => (
              <div className="embla__slide" key={key}>
                <div className="relative overflow-hidden h-fit">
                  <h1 className=" font-semibold">{key}</h1>
                  <table className="w-full text-left mt-2 text-sm">
                    <tbody>
                      <tr className="text-sm text-left">
                        <th>Descripción</th>
                        <th>Monto</th>
                        <th>Fecha</th>
                      </tr>
                      {value.map((wallet, i) => (
                        <tr key={i}>
                          <td className="flex items-center space-x-1">
                            {wallet.tipo === "Compra" ? (
                              <ShoppingBagIcon className="h-4 mt-[1px]" />
                            ) : (
                              <ReceiptRefundIcon className="h-4 mt-[1px]" />
                            )}
                            <p>
                              {wallet.tipo} de {wallet.cantidad}{" "}
                              {wallet.cantidad > 1 ? "acciones" : "acción"}{" "}
                            </p>
                          </td>
                          <td>
                            <CurrencyFormat
                              value={wallet.monto}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"$"}
                              renderText={(value) => <p>{value}</p>}
                            />
                          </td>
                          <td>{wallet.fecha}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {getGanacias(key)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default WalletCarousel;
