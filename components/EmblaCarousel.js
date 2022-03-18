import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton } from "./EmblaCarouselButtons";
import CurrencyFormat from "react-currency-format";
import Ticket from "./Ticket";

const SCALE_FACTOR = 3;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

function EmblaCarousel({ acciones }) {
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
          <div className="embla__container space-x-5">
            {acciones.map((accion) => (
              <div className="embla__slide" key={accion.id}>
                <div className="embla__slide__inner">
                  <Ticket
                    id={accion.id}
                    nombre={accion.nombre}
                    fecha={accion.fecha}
                    cantidad={accion.cantidad}
                    valor={accion.valor}
                    comision={accion.comision}
                    total={accion.total}
                    urlImg={accion.urlImg}
                  />
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

export default EmblaCarousel;
