document.addEventListener("DOMContentLoaded", async function () {
  const body = document.body;

  const contenedor = document.createElement("div");
  contenedor.className = "contenedor";

  const logo1 = document.createElement("div");
  logo1.className = "logo";
  const img1 = document.createElement("img");
  img1.src = "./imagenes/Api.png";
  img1.alt = "Apibcs";
  logo1.appendChild(img1);

  const logo2 = document.createElement("div");
  logo2.className = "logo";
  const img2 = document.createElement("img");
  img2.src = "./imagenes/GBCS.png";
  img2.alt = "Gobierno";
  logo2.appendChild(img2);

  contenedor.appendChild(logo2);
  contenedor.appendChild(logo1);

  body.appendChild(contenedor);

  const createTableSection = (title, rows) => {
      const h2 = document.createElement("h2");
      h2.textContent = title;
      body.appendChild(h2);

      const tablaContainer = document.createElement("div");
      tablaContainer.className = "tabla-container";

      const tabla = document.createElement("div");
      tabla.className = "tabla";

      const headerRow = document.createElement("div");
      headerRow.className = "fila";
      const headers = [
          "HORA",
          "NAVIERAS",
          "BUQUES",
          "DESTINO",
          "MUELLE",
          "ATRAQUE",
          "ESTATUS",
      ];
      headers.forEach((header) => {
          const celda = document.createElement("div");
          celda.className = "celda";
          celda.textContent = header;
          headerRow.appendChild(celda);
      });
      tabla.appendChild(headerRow);

      rows.forEach((row) => {
          const fila = document.createElement("div");
          fila.className = "fila";

          row.forEach((cell) => {
              const celda = document.createElement("div");
              celda.className = "celda";
              celda.textContent = cell;
              fila.appendChild(celda);
          });

          tabla.appendChild(fila);
      });

      tablaContainer.appendChild(tabla);
      body.appendChild(tablaContainer);
  };

  try {
      const response = await fetch('/getBarcos');
      const barcos = await response.json();

      const arribosRows = barcos.map(barco => [
          barco.navieras,          
          barco.buques,
          barco.destino,
          barco.muelle,
          barco.atraque,
          barco.estatus,
          barco.hora
      ]);

      createTableSection("ARRIBOS", arribosRows);
  } catch (error) {
      console.error('Error al obtener los datos:', error);
  }
});
