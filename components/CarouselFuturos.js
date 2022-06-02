import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, NextButton, PrevButton } from "./EmblaCarouselButtons";
import TicketFuturo from "./TicketFuturo";

function EmblaCarousel({ nombre, valores }) {
  const visibleButton = valores.length > 1 ? true : false;
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
  return (
    <div>
      <div className="embla shadow-sm">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container space-x-5 ">
            {valores.map((valor) => (
              <div className="embla__slide" key={nombre}>
                <div className="embla__slide__inner ">
                  <TicketFuturo
                    key={valor.id}
                    id={valor.id}
                    nombre={valor.nombre}
                    fecha={valor.fecha}
                    inversion={valor.inversion}
                    tarifa={valor.tarifa}
                    plazo={valor.plazo}
                    unidad={valor.unidad}
                    urlImg={valor.urlImg}
                  />
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
