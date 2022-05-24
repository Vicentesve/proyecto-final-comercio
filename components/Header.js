import React from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ChartBarIcon,
  MenuIcon,
  ReceiptRefundIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  CreditCardIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
} from "@heroicons/react/outline";
import { BiUser } from "react-icons/bi";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import Swal from "sweetalert2";

// Exports
export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;
export const HoverCardContent = HoverCardPrimitive.HoverCardContent;

function Header(props) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header>
      <div className="bg-[#232F3E] text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-1 sm:mr-10 ">
          <MenuIcon onClick={props.click} className="h-7 mt-[2px] sm:hidden" />
          <img className="h-7  sm:h-12 object-contain" src="/logo2.png" />
        </div>

        <div className="scrollbar-hide overflow-x-scroll hidden sm:space-x-5 md:space-x-10 mt-2 sm:flex px-1">
          <div className="elementsNav">
            <PresentationChartBarIcon className="h-4" />
            <HoverCard>
              <HoverCardTrigger>
                <p>Mercado de capitales</p>
              </HoverCardTrigger>
              <HoverCardContent className="w-60 bg-white border border-[#c7bbbb] rounded-md shadow-md p-2">
                <div className="flex flex-col space-y-3">
                  <div
                    onClick={() => {
                      if (session) {
                        router.push("/misacciones");
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Inicia sesión para ver tus acciones",
                        });
                      }
                    }}
                    className="subElementsNav"
                  >
                    <ChartBarIcon className="h-4" />
                    <button>Mis acciones</button>
                  </div>

                  <div
                    onClick={() => {
                      if (session) {
                        router.push("/comprar");
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Inicia sesión comprar acciones",
                        });
                      }
                    }}
                    className="subElementsNav"
                  >
                    <ShoppingBagIcon className="h-4" />
                    <button>Comprar acciones</button>
                  </div>

                  <div
                    onClick={() => {
                      if (session) {
                        router.push("/vender");
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Inicia sesión para vender acciones",
                        });
                      }
                    }}
                    className="subElementsNav"
                  >
                    <ReceiptRefundIcon className="h-4" />
                    <button>Vender acciones</button>
                  </div>

                  <div
                    onClick={() => {
                      if (session) {
                        router.push("/micartera");
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Inicia sesión para ver tu cartera",
                        });
                      }
                    }}
                    className="subElementsNav"
                  >
                    <CreditCardIcon className="h-4" />
                    <button>Mi cartera</button>
                  </div>
                </div>
                <HoverCardPrimitive.HoverCardArrow className="fill-white" />
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="elementsNav">
            <PresentationChartLineIcon className="h-4" />
            <HoverCard>
              <HoverCardTrigger>
                <p>Mercado de derivados</p>
              </HoverCardTrigger>
              <HoverCardContent className="w-60 bg-white border border-[#c7bbbb] rounded-md shadow-md p-2">
                <div className="flex flex-col space-y-3">
                  <div
                    onClick={() => {
                      if (session) {
                        router.push("/misfuturos");
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Inicia sesión para ver tus acciones",
                        });
                      }
                    }}
                    className="subElementsNav"
                  >
                    <ChartPieIcon className="h-4" />
                    <button>Mis futuros</button>
                  </div>

                  <div
                    onClick={() => {
                      if (session) {
                        router.push("/comprarfuturos");
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Inicia sesión comprar acciones",
                        });
                      }
                    }}
                    className="subElementsNav"
                  >
                    <ShoppingBagIcon className="h-4" />
                    <button>Comprar futuros</button>
                  </div>

                  <div
                    onClick={() => {
                      if (session) {
                        router.push("/vender-futuros");
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Inicia sesión para vender acciones",
                        });
                      }
                    }}
                    className="subElementsNav"
                  >
                    <ReceiptRefundIcon className="h-4" />
                    <button>Vender futuros</button>
                  </div>

                  <div
                    onClick={() => {
                      if (session) {
                        router.push("/mi-cartera-futuros");
                      } else {
                        Swal.fire({
                          icon: "warning",
                          title: "Inicia sesión para ver tu cartera",
                        });
                      }
                    }}
                    className="subElementsNav"
                  >
                    <CreditCardIcon className="h-4" />
                    <button>Mi cartera</button>
                  </div>
                </div>
                <HoverCardPrimitive.HoverCardArrow className="fill-white" />
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <div
          className="transition duration-100 transform hover:scale-110
         cursor-pointer flex whitespace-nowrap mt-1 sm:mt-2 items-center sm: ml-8 space-x-2"
        >
          <p
            className="hidden sm:inline-block"
            onClick={!session ? signIn : signOut}
          >
            {session
              ? `Bienvenido, ${session.user.name.substring(
                  0,
                  session.user.name.indexOf(" ")
                )} ›`
              : "Sign In ›"}
          </p>
          <p className="sm:hidden" onClick={!session ? signIn : signOut}>
            {session
              ? `${session.user.name.substring(
                  0,
                  session.user.name.indexOf(" ")
                )} ›`
              : "Sign In ›"}
          </p>
          <UserCircleIcon className="h-7 mt-1" />
        </div>
      </div>
    </header>
  );
}

export default Header;
