let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "192.168.0.250",
  database: "apit2",
  user: "jorge",
  password: "",
});

connection.connect(function (err) {
  if (err) {
    console.error("Error de conexión:", err.message);
    return;
  }
  console.log("Conexión exitosa");

  //  interactuar BD

connection.query("SELECT * FROM tabla", function (err, results, fields) {
  if (err) {
    console.error("Error al ejecutar la consulta:", err.message);
    return;
  }
  //  resultados de la consulta
  console.log("Resultados:", results);
});


  // Cerrar conexión
  connection.end(function (err) {
    if (err) {
      console.error("Error al cerrar la conexión:", err.message);
    } else {
      console.log("Conexión cerrada");
    }
  });
});
