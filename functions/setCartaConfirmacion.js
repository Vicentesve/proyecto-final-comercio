import jsPDF from "jspdf";
import "jspdf-autotable";
import myImage from "./myImage";

export default function setCartaConfirmacion() {
  function wrapText(
    doc,
    line,
    lineHeight,
    leftMargin,
    wrapWidth,
    fontSize,
    body
  ) {
    doc.setFontSize(fontSize);

    var splitText = doc.splitTextToSize(body, wrapWidth);
    for (var i = 0, length = splitText.length; i < length; i++) {
      doc.text(splitText[i], leftMargin, line);
      line = lineHeight + line;
    }
  }

  function setCarta(to, tipo_operacion, table) {
    var doc = new jsPDF();

    doc.addImage(myImage, "JPEG", 140, -2, 65, 20);

    let pageWidth = doc.internal.pageSize.getWidth();
    doc.text("Carta de confirmación", pageWidth / 2, 20, "center");

    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    doc.setFontSize("11");

    if (month < 10) {
      doc.text(`Fecha: ${day}/0${month}/${year}`, 10, 30);
    } else {
      doc.text(`Fecha: ${day}/${month}/${year}`, 10, 30);
    }
    doc.text(`Para: ${to}`, 10, 35, "left");
    doc.text("De: Simply Wallet St", 10, 40, "left");
    doc.text(
      `Re: Carta de comfirmación en ${tipo_operacion.toLowerCase()}`,
      10,
      45,
      "left"
    );

    doc.text("Estimados Sra. o Sr.", 10, 55, "left");

    var body = `El propósito de esta comunicación es confirmar los términos y condiciones de la transacción realizada entre nosotros.\nEsta comunicación constituye una Confirmación como se menciona en el Acuerdo Marco ISDA especificado a continuación.\nHemos procedido a relizar la siguiente operación ${tipo_operacion.toUpperCase()}, de acuerdo a la carta de confirmación no. 9424247 enviada por usted.`;

    wrapText(doc, 65, 5, 10, 185, 9, body);

    let cols = [
      {
        title: "Details",
        dataKey: "details",
      },
      {
        title: "Values",
        dataKey: "values",
      },
    ];

    let entries = Object.keys(table);
    let rows = entries.map((key) => {
      return { details: key, values: table[key] };
    });

    /* doc.autoTable(cols, rows, {
      theme: "grid",
      startY: 90,
      showHead: "never",
    }); */

    doc.autoTable({
      theme: "grid",
      columns: [
        {
          title: "Details",
          dataKey: "details",
        },
        {
          title: "Values",
          dataKey: "values",
        },
      ],
      body: rows,
      startY: 90,
      showHead: "never",
    });

    doc.save(`carta_confirmacion_${tipo_operacion.toLowerCase()}.pdf`);
  }

  return {
    setCarta,
  };
}
