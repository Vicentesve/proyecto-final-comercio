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
      <div className="sm:hidden flex items-center justify-between p-2 bg-[#232F3E] text-white">
        <div className="flex space-x-2">
          <MenuIcon onClick={props.click} className="h-7 mt-[2px]" />
          <img className="h-7" src="/logo2.png" alt="" />
        </div>
        <div className="flex items-center space-x-1">
          <p
            onClick={!session ? signIn : signOut}
            className="text-sm font-semibold"
          >
            {session
              ? `${session.user.name.substring(
                  0,
                  session.user.name.indexOf(" ")
                )} ›`
              : "Sign In ›"}
          </p>
          <BiUser className="w-6 h-6" />
        </div>
      </div>

      <div className="hidden p-3 bg-[#232F3E] text-white md:flex justify-between items-center">
        <div className="flex">
          <img className="h-12" src="/logo2.png" alt="" />
          <div className="ml-10 flex space-x-10 mt-2">
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
              onClick={() => router.push("/comprar")}
              className="elementsNav"
            >
              <ShoppingBagIcon className="h-4" />
              <button>Comprar acciones</button>
            </div>
            <div onClick={() => router.push("/vender")} className="elementsNav">
              <ReceiptRefundIcon className="h-4" />
              <button>Vender acciones</button>
            </div>
            <div
              onClick={() => router.push("/micartera")}
              className="elementsNav"
            >
              <CreditCardIcon className="h-4" />
              <button>Mi cartera</button>
            </div>
          </div>
        </div>
        <div className="hover:underline flex items-center space-x-2 cursor-pointer">
          <p onClick={!session ? signIn : signOut} className="font-semibold">
            {session
              ? `Bienvenido, ${session.user.name.substring(
                  0,
                  session.user.name.indexOf(" ")
                )} ›`
              : "Sign In ›"}
          </p>
          <UserCircleIcon className="h-8" />
        </div>
      </div>
    </header>
  );
}

export default Header;
