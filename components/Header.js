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
} from "@heroicons/react/outline";
import { BiUser } from "react-icons/bi";
import Swal from "sweetalert2";

function Header(props) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header>
      <div className="bg-[#232F3E] text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-1 sm:mr-10 border border-white">
          <MenuIcon onClick={props.click} className="h-7 mt-[2px] sm:hidden" />
          <img className="h-7  sm:h-12 object-contain" src="/logo2.png" />
        </div>

        <div className="scrollbar-hide overflow-x-scroll hidden sm:space-x-5 md:space-x-10 mt-2 sm:flex px-1">
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
            className="elementsNav"
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
            className="elementsNav"
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
            className="elementsNav"
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
            className="elementsNav"
          >
            <CreditCardIcon className="h-4" />
            <button>Mi cartera</button>
          </div>
          <div className="absolute top-0 right-52 bg-gradient-to-l from-[#232F3E] h-20 w-1/12" />
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
