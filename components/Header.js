import React from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { LoginIcon } from "@heroicons/react/outline";

function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-400 shadow-md">
      <div className="flex justify-end p-5 items-center space-x-3">
        <p className="font-bold">
          {session
            ? `Bienvenido ${session.user.name.substring(
                0,
                session.user.name.indexOf(" ")
              )} ›`
            : ""}
        </p>
        <div
          className="flex space-x-2 items-center bg-blue-500 p-1 rounded-lg text-white px-5 py-2 whitespace-nowrap cursor-pointer 
          hover:bg-blue-600"
          onClick={session ? signOut : signIn}
        >
          <LoginIcon className="h-6" />
          <button>{session ? "Cerrar sesión" : "Iniciar sesión"}</button>
        </div>
      </div>
      <div className="flex justify-center space-x-10 p-5">
        <button
          onClick={() => router.push("/comprar")}
          className={`${session ? "button" : "buttonDis"}`}
        >
          Comprar
        </button>
        <button
          onClick={() => router.push("/vender")}
          className={`${session ? "button" : "buttonDis"}`}
        >
          Vender
        </button>
        <button
          onClick={() => router.push("/misacciones")}
          className={`${session ? "button" : "buttonDis"}`}
        >
          Mis acciones
        </button>
      </div>
    </header>
  );
}

export default Header;
