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
      <CurrencyFormat
        value={ganacias}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
        decimalScale={2}
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
    );
  }
  //#endregion

  return (
    <div className="flex flex-col justify-between h-[400px] overflow-y-scroll scrollbar-hide">
      <div>
        <div className="flex justify-between mb-10">
          <h1 className="font-semibold">{llave}</h1>
          {getGanacias(llave)}
        </div>
        <table className="w-full text-left mt-2 text-xs sm:text-sm ">
          <tr className="text-sm text-left">
            <th>Descripción</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
          <tbody>
            {value.map((wallet, i) => (
              <tr key={i}>
                <td>
                  <div className="flex space-x-2">
                    {wallet.tipo === "Compra" ? (
                      <ShoppingBagIcon className="h-4 mt-[1px]" />
                    ) : (
                      <ReceiptRefundIcon className="h-4 mt-[1px]" />
                    )}
                    <p>
                      {wallet.tipo} de {wallet.cantidad}{" "}
                      {wallet.cantidad > 1 ? "acciones" : "acción"}
                    </p>
                  </div>
                </td>
                <td>
                  <CurrencyFormat
                    value={wallet.monto}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    decimalScale={2}
                    renderText={(value) => <p>{value}</p>}
                  />
                </td>
                <td>{wallet.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableGanancias;
