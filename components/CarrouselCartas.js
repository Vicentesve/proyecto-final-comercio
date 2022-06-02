import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, NextButton, PrevButton } from "./EmblaCarouselButtons";
import funcionesPDF from "./../functions/setCartaConfirmacion";
import { useSession } from "next-auth/react";
import { DownloadIcon } from "@heroicons/react/outline";

function EmblaCarousel({ cartas }) {
  const visibleButton = cartas.length > 1 ? true : false;
  //#region Configuration Embla
  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
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
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, setScrollSnaps, onSelect]);
  //#endregion
  const { setCarta } = funcionesPDF();
  const { data: session } = useSession();

  return (
    <div>
      <div className="embla">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container space-x-5">
            {cartas.map((key, i) => (
              <div className="embla__slide" key={i}>
                <div className="embla__slide__inner ">
                  <div className="border border-gray-300 rounded-md shadow-lg p-5 w-full flex flex-col items-center h-[550px]">
                    {Object.keys(key).map((valor, i) => {
                      if (valor !== "id") {
                        return (
                          <div className="flex space-x-2">
                            <p className=" font-semibold">{valor}:</p>
                            <p>{key[valor]}</p>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className="text-center font-semibold text-xl mb-5"
                            key={i}
                          >
                            <p>Carta de confirmación</p>
                            <p>{key[valor]}</p>
                          </div>
                        );
                      }
                    })}
                    <button
                      onClick={() => {
                        setCarta(
                          session.user.name,
                          key["Tipo de operación"],
                          key
                        );
                      }}
                      className="bg-[#232F3E] hover:bg-[#3d5068] text-white rounded-md p-3 flex items-center space-x-2 mt-10"
                    >
                      <DownloadIcon className="h-5" />
                      <p>Exportar</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {visibleButton ? (
          <>
            <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
            <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
          </>
        ) : (
          <></>
        )}
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

export default EmblaCarousel;
