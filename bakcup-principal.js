document.addEventListener("DOMContentLoaded", function () {
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
                      if (typeof cell === "string") {
                        celda.textContent = cell;
                      } else {
                        const img = document.createElement("img");
                        img.src = cell.src;
                        img.alt = cell.alt;
                        celda.appendChild(img);
                      }
                      fila.appendChild(celda);
                    });
              
                    tabla.appendChild(fila);
                  });
              
                  tablaContainer.appendChild(tabla);
                  body.appendChild(tablaContainer);
                };
              
                const arribosRows = [
                  [
                    "18:00",
                    { src: "./imagenes/logo_bf.png", alt: "Baja Ferries" },
                    "Buque-1",
                    "Muelle-1",
                    "En viaje",
                    "Mu-1",
                    "En viaje",
                  ],
                  [
                    "20:00",
                    { src: "./imagenes/TMC.PNG", alt: "TMC" },
                    "Buque-2",
                    "Muelle-2",
                    "En puerto",
                    "Mu-2",
                    "En puerto",
                  ],
                ];
              
                const salidasRows = [
                  [
                    "10:00",
                    { src: "./imagenes/logo_bf.png", alt: "Baja Ferries" },
                    "Buque-1",
                    "Muelle-1",
                    "En viaje",
                    "Mu-1",
                    "En viaje",
                  ],
                  [
                    "12:00",
                    { src: "TMC.PNG", alt: "TMC" },
                    "Buque-2",
                    "Muelle-2",
                    "En puerto",
                    "Mu-2",
                    "En puerto",
                  ],
                ];
              
                createTableSection("ARRIBOS",arribosRows);
                createTableSection("SALIDAS",salidasRows);
              });
              