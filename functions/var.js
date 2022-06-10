import run_historical from "./../historical/run.json";
import amzn_historical from "./../historical/amzn.json";
import tsla_historical from "./../historical/tsla.json";
import dis_historical from "./../historical/dis.json";

export default function valor_de_riesgo() {
  function generar_valor_de_riesgo(type, valor, cantidad) {
    let last_open = 0;
    let diff = 0;
    let valor_manana = 0;
    let valuacion_manana = 0;
    let p_l_manana = [];
    let historical = getType(type);

    historical.map((data) => {
      //Diferencial
      diff = data.Open / last_open - 1;
      data.diff = diff;
      last_open = data.Open;

      //Valor mañana
      valor_manana = valor * diff + valor;
      data.valor_manana = valor_manana;

      //Valuación mañana
      valuacion_manana = valor_manana * cantidad;
      data.valuacion_manana = valuacion_manana;

      //P&L mañana
      p_l_manana.push(valuacion_manana - valor * cantidad);
    });

    return generateFinalTable(p_l_manana, historical);
  }

  function getType(type) {
    switch (type) {
      case "TSLA":
        return tsla_historical;
      case "AMZN":
        return amzn_historical;
      case "DIS":
        return dis_historical;
      case "NFLX":
        return [];
      case "RUN":
        return run_historical;
      default:
        return [];
    }
  }

  function generateFinalTable(p_l_manana, historical) {
    quickSort(p_l_manana, 0, p_l_manana.length - 1);

    let resultados = [];
    for (let i = 0; i < 30; i++) {
      let prob = (i + 1) / historical.length;
      resultados.push({
        index: i + 1,
        p_l_manana: p_l_manana[i],
        prob,
        var:
          Math.floor(prob * 100) === 1 || Math.floor(prob * 100) === 5
            ? true
            : false,
      });
    }
    return resultados;
  }

  const quickSort = (arr, low, high) => {
    if (low < high) {
      const border = partition(arr, low, high);
      quickSort(arr, low, border - 1);
      quickSort(arr, border + 1, high);
    }
  };

  const partition = (array, low, high) => {
    const pivot = array[high];
    let i = low - 1;
    let temp;
    for (let j = low; j < high; j++) {
      if (pivot > array[j]) {
        i++;
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
    temp = array[i + 1];
    array[i + 1] = array[high];
    array[high] = temp;
    return i + 1;
  };

  return {
    generar_valor_de_riesgo,
  };
}
