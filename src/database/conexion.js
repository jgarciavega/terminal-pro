import {createPool} from "mysql2/promise"

export const pool = createPool({
    host: "192.168.0.250",  // Cambiado a la IP que funciona
    port: 3306,
    database: "buquesbd",
    user: "jorge",  // Cambiado al usuario correcto
    password: "",
})
