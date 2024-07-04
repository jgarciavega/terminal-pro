import { pool } from "./database/conexion.js";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

// Resuelve __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint para obtener datos de los barcos
app.get('/getBarcos', async (req, res) => {
    try {
        const [result] = await pool.query("SELECT navieras, buques, destino, muelle, atraque, estatus, hora FROM arribos");
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los datos');
    }
});

// Ruta raíz para servir index.html
app.get('/', (req, res) => {
    const indexPath = path.resolve(__dirname, '../public', 'index.html');
    res.sendFile(indexPath);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
