import { ReceiptRefundIcon, ShoppingBagIcon } from "@heroicons/react/outline";
import React from "react";
import CurrencyFormat from "react-currency-format";

function TableGanancias({ llave, value, myWallet }) {
  //#region getGanancias
  function getGanacias(pAccionID) {
    let ganacias = 0;
    Object.entries(myWallet).map(([key, wallets]) => {
      if (key === pAccionID) {
        wallets.map((wallet) => {
          if (wallet.tipo == "Venta") {
            ganacias += wallet.monto;
          } else {
            ganacias -= wallet.monto;
          }
        });
      }
    });

    return (
      <div className="mt-10">
        <CurrencyFormat
          value={ganacias}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
          renderText={(value) => (
            <p
              className={`font-semibold text-right ${
                ganacias < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              Ganancia: {value}
            </p>
          )}
        />
      </div>
    );
  }
  //#endregion

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="font-semibold">{llave}</h1>
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
      </div>
      {getGanacias(llave)}
    </div>
  );
}

export default TableGanancias;
