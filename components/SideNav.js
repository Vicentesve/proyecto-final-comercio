import {
  XIcon,
  HomeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  ReceiptRefundIcon,
  LogoutIcon,
  LoginIcon,
} from "@heroicons/react/outline";
import { AiOutlineStock } from "react-icons/ai";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

function SideNav(props) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-full h-full z-50 bg-black_rgba 
      ${props.state ? "translate-x-0" : "translate-x-full"}`}
      ></div>
      <div
        onClick={props.click}
        className={`text-white fixed top-0 -right-44 cursor-pointer z-80 
        ${props.state ? " -translate-x-80" : "translate-x-full"}`}
      >
        <XIcon className="h-6 mt-8" />
      </div>

      <nav
        className={`w-6/12 fixed overflow-y-scroll overflow-x-hidden h-full z-100 top-0 left-0 bg-[#232F3E] text-white 
        ease-in-out duration-300  ${
          props.state ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {session ? (
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center space-x-1 p-2 mb-3 border-b border-white pb-3 bg-white text-[#232F3E]">
                <HomeIcon className="h-5 mt-8" />
                <h1 className="font-semibold text-sm mt-8">Menú principal</h1>
              </div>

              <div className="flex flex-col space-y-4 p-2">
                <div
                  onClick={() => router.push("/misacciones")}
                  className="elementsSideNav"
                >
                  <ChartBarIcon className="h-4" />
                  <button>Mis acciones</button>
                </div>

                <div
                  onClick={() => router.push("/comprar")}
                  className="elementsSideNav"
                >
                  <ShoppingBagIcon className="h-4" />
                  <button>Comprar acciones</button>
                </div>

                <div className="elementsSideNav">
                  <ReceiptRefundIcon className="h-4" />
                  <button>Vender acciones</button>
                </div>
              </div>
            </div>

            <div
              onClick={signOut}
              className="flex space-x-2 items-center justify-end p-2"
            >
              <LogoutIcon className="h-5 mt-1" />
              <p className="text-sm font-semibold">Cerrar Sesión</p>
            </div>
          </div>
        ) : (
          <div
            onClick={signIn}
            className="flex space-x-1 justify-center items-center p-1 hover:bg-[#3d5068]"
          >
            <LoginIcon className="h-5 mt-1" />
            <button className="text-sm font-semibold hover:bg-[#3d5068] p-2 whitespace-nowrap">
              Inicia sesión <p className="underline inline-block">aquí.</p>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}

export default SideNav;
