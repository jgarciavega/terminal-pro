import express from 'express';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Configurar dotenv
dotenv.config();

// Resolver __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar JSON
app.use(express.json());

// 🔗 Conexión al pool de MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'jorge',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'buquesbd',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Ruta raíz que sirve app.html (nueva página principal)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/app.html'));
});

// ✅ API para consultar datos de arribos y salidas
app.get('/api/buques', async (req, res) => {
  try {
    const [arribos] = await pool.query(`
      SELECT naviera, buque, destino, muelle, atraque, estatus, hora
      FROM arribos
    `);
    const [salidas] = await pool.query(`
      SELECT naviera, buque, destino, muelle, atraque, estatus, hora
      FROM salidas
    `);
    res.json({ arribos, salidas });
  } catch (err) {
    console.error('❌ Error en /api/buques:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// � Ruta para inicializar la base de datos
app.get('/init-db', async (req, res) => {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../init-db.sql'),
      'utf8'
    );

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'jorge',
      password: process.env.DB_PASSWORD || 'password123',
      multipleStatements: true
    });

    await connection.query(sql);
    await connection.end();
    
    res.json({ 
      success: true, 
      message: 'Base de datos inicializada correctamente con estructura completa' 
    });
  } catch (err) {
    console.error('❌ Error al inicializar base:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// �🔁 Ruta para restaurar la base de datos desde script SQL
app.get('/reset-db', async (req, res) => {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../buquesbd_script.sql'),
      'utf8'
    );

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'jorge',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    await connection.query(sql);
    res.json({ success: true, message: 'Base de datos restaurada correctamente' });
  } catch (err) {
    console.error('❌ Error al restaurar base:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Rutas compatibles con el frontend existente
app.get('/getBarcosEntradas', async (req, res) => {
  try {
    console.log('🔍 Recibida petición para /getBarcosEntradas');
    const [result] = await pool.query(`
      SELECT naviera, buque, destino, muelle, atraque, estatus, hora 
      FROM arribos
    `);
    console.log('📊 Datos encontrados:', result.length, 'registros');
    console.log('📋 Primer registro:', result[0]);
    res.json(result);
  } catch (err) {
    console.error('❌ Error en /getBarcosEntradas:', err.message);
    res.status(500).json({ error: err.message, details: 'Error al obtener arribos' });
  }
});

app.get('/getBarcosSalidas', async (req, res) => {
  try {
    console.log('🔍 Recibida petición para /getBarcosSalidas');
    const [result] = await pool.query(`
      SELECT naviera, buque, destino, muelle, atraque, estatus, hora 
      FROM salidas
    `);
    console.log('📊 Datos de salidas encontrados:', result.length, 'registros');
    console.log('📋 Primer registro de salidas:', result[0]);
    res.json(result);
  } catch (err) {
    console.error('❌ Error en /getBarcosSalidas:', err.message);
    res.status(500).json({ error: err.message, details: 'Error al obtener salidas' });
  }
});

// 🩺 ENDPOINT DE DIAGNÓSTICO
app.get('/test-db', async (req, res) => {
  try {
    console.log('🩺 Probando conexión a base de datos...');
    
    // Probar conexión básica
    const [connection] = await pool.query('SELECT 1 as test');
    console.log('✅ Conexión a DB exitosa');
    
    // Verificar existencia de tablas
    const [tables] = await pool.query('SHOW TABLES');
    console.log('📋 Tablas disponibles:', tables);
    
    // Contar registros en arribos
    const [arribosCount] = await pool.query('SELECT COUNT(*) as count FROM arribos');
    console.log('🚢 Arribos en BD:', arribosCount[0].count);
    
    // Contar registros en salidas
    const [salidasCount] = await pool.query('SELECT COUNT(*) as count FROM salidas');
    console.log('⛵ Salidas en BD:', salidasCount[0].count);
    
    res.json({
      status: 'OK',
      database: 'Connected',
      tables: tables,
      arribos: arribosCount[0].count,
      salidas: salidasCount[0].count
    });
    
  } catch (err) {
    console.error('❌ Error en diagnóstico:', err.message);
    res.status(500).json({ 
      status: 'ERROR',
      error: err.message,
      code: err.code 
    });
  }
});

// 📊 ENDPOINT: Métricas del día para dashboard - Puerto La Paz
app.get('/api/metricas-dia', async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Arribos a La Paz (desde Mazatlán y Topolobampo)
    const [arribosResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM arribos WHERE DATE(fecha_arribo) = ?',
      [hoy]
    );
    
    // Salidas de La Paz (hacia Mazatlán y Topolobampo)
    const [salidasResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM salidas WHERE DATE(fecha_salida) = ?',
      [hoy]
    );
    
    // Operaciones por destino
    const [mazatlanOps] = await pool.execute(`
      SELECT COUNT(*) as count FROM (
        SELECT 1 FROM arribos WHERE DATE(fecha_arribo) = ? AND destino = 'Mazatlán'
        UNION ALL
        SELECT 1 FROM salidas WHERE DATE(fecha_salida) = ? AND destino = 'Mazatlán'
      ) ops
    `, [hoy, hoy]);
    
    const [topolobampoOps] = await pool.execute(`
      SELECT COUNT(*) as count FROM (
        SELECT 1 FROM arribos WHERE DATE(fecha_arribo) = ? AND destino = 'Topolobampo'
        UNION ALL
        SELECT 1 FROM salidas WHERE DATE(fecha_salida) = ? AND destino = 'Topolobampo'
      ) ops
    `, [hoy, hoy]);
    
    // Próximas operaciones por ruta
    const [proximasMazatlan] = await pool.execute(`
      (SELECT 'Arribo' as tipo, hora, buque, naviera FROM arribos 
       WHERE DATE(fecha_arribo) = ? AND hora > TIME(NOW()) AND destino = 'Mazatlán'
       ORDER BY hora LIMIT 1)
      UNION
      (SELECT 'Salida' as tipo, hora, buque, naviera FROM salidas 
       WHERE DATE(fecha_salida) = ? AND hora > TIME(NOW()) AND destino = 'Mazatlán'
       ORDER BY hora LIMIT 1)
      ORDER BY hora LIMIT 1
    `, [hoy, hoy]);
    
    const [proximasTopolobampo] = await pool.execute(`
      (SELECT 'Arribo' as tipo, hora, buque, naviera FROM arribos 
       WHERE DATE(fecha_arribo) = ? AND hora > TIME(NOW()) AND destino = 'Topolobampo'
       ORDER BY hora LIMIT 1)
      UNION
      (SELECT 'Salida' as tipo, hora, buque, naviera FROM salidas 
       WHERE DATE(fecha_salida) = ? AND hora > TIME(NOW()) AND destino = 'Topolobampo'
       ORDER BY hora LIMIT 1)
      ORDER BY hora LIMIT 1
    `, [hoy, hoy]);
    
    res.json({
      arribos: arribosResult[0].count,
      salidas: salidasResult[0].count,
      mazatlanOps: mazatlanOps[0].count,
      topolobampoOps: topolobampoOps[0].count,
      proximasMazatlan: proximasMazatlan.length > 0 
        ? `${proximasMazatlan[0].hora.substring(0,5)} - ${proximasMazatlan[0].buque} (${proximasMazatlan[0].tipo})`
        : null,
      proximasTopolobampo: proximasTopolobampo.length > 0 
        ? `${proximasTopolobampo[0].hora.substring(0,5)} - ${proximasTopolobampo[0].buque} (${proximasTopolobampo[0].tipo})`
        : null,
      fecha: hoy
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo métricas:', error.message);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// 🚢 ENDPOINT: Datos maestros de buques reales
app.get('/api/buques-maestros', (req, res) => {
  const buquesMaestros = {
    "TMC": [
      { nombre: "Santa Rita", codigo: "SR", capacidad: "1200 pasajeros" },
      { nombre: "San Jorge", codigo: "SJ", capacidad: "1000 pasajeros" }
    ],
    "BajaFerries": [
      { nombre: "Mexico Star", codigo: "MS", capacidad: "1500 pasajeros" },
      { nombre: "California Star", codigo: "CS", capacidad: "1300 pasajeros" },
      { nombre: "Cabo Star", codigo: "CB", capacidad: "1100 pasajeros" }
    ]
  };
  
  res.json(buquesMaestros);
});

// 📈 ENDPOINT: Estadísticas por naviera
app.get('/api/estadisticas-naviera', async (req, res) => {
  try {
    const { periodo = '7' } = req.query; // días
    
    const [stats] = await pool.execute(`
      SELECT 
        naviera,
        COUNT(*) as total_operaciones,
        COUNT(CASE WHEN tipo_operacion = 'arribo' THEN 1 END) as arribos,
        COUNT(CASE WHEN tipo_operacion = 'salida' THEN 1 END) as salidas
      FROM (
        SELECT naviera, 'arribo' as tipo_operacion, fecha_arribo as fecha 
        FROM arribos 
        WHERE fecha_arribo >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        UNION ALL
        SELECT naviera, 'salida' as tipo_operacion, fecha_salida as fecha 
        FROM salidas 
        WHERE fecha_salida >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ) operaciones
      WHERE naviera IN ('TMC', 'BajaFerries')
      GROUP BY naviera
    `, [periodo, periodo]);
    
    res.json(stats);
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.message);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// 🗂️ ENDPOINT: Insertar datos de ejemplo realistas
app.post('/api/datos-ejemplo', async (req, res) => {
  try {
    // Limpiar tablas primero
    await pool.execute('DELETE FROM arribos');
    await pool.execute('DELETE FROM salidas');
    
    // Datos de ejemplo realistas para TMC y BajaFerries
    const datosEjemplo = {
      arribos: [
        {
          naviera: 'TMC',
          buque: 'Santa Rita',
          destino: 'Mazatlán',
          muelle: 'Muelle 1',
          atraque: 'A-1',
          estatus: 'En tránsito',
          hora: '08:30:00',
          fecha_arribo: '2025-06-28'
        },
        {
          naviera: 'BajaFerries',
          buque: 'Mexico Star',
          destino: 'Topolobampo',
          muelle: 'Muelle 2',
          atraque: 'B-1',
          estatus: 'Confirmado',
          hora: '14:15:00',
          fecha_arribo: '2025-06-28'
        },
        {
          naviera: 'TMC',
          buque: 'San Jorge',
          destino: 'Mazatlán',
          muelle: 'Muelle 3',
          atraque: 'A-2',
          estatus: 'Atracado',
          hora: '16:45:00',
          fecha_arribo: '2025-06-28'
        },
        {
          naviera: 'BajaFerries',
          buque: 'California Star',
          destino: 'Topolobampo',
          muelle: 'Muelle 1',
          atraque: 'B-2',
          estatus: 'En tránsito',
          hora: '19:30:00',
          fecha_arribo: '2025-06-28'
        },
        {
          naviera: 'TMC',
          buque: 'Santa Rita',
          destino: 'Topolobampo',
          muelle: 'Muelle 2',
          atraque: 'A-3',
          estatus: 'Programado',
          hora: '07:15:00',
          fecha_arribo: '2025-06-28'
        },
        {
          naviera: 'BajaFerries',
          buque: 'Cabo Star',
          destino: 'Mazatlán',
          muelle: 'Muelle 1',
          atraque: 'B-3',
          estatus: 'Confirmado',
          hora: '10:45:00',
          fecha_arribo: '2025-06-28'
        },
        {
          naviera: 'TMC',
          buque: 'San Jorge',
          destino: 'Topolobampo',
          muelle: 'Muelle 3',
          atraque: 'A-4',
          estatus: 'En tránsito',
          hora: '13:20:00',
          fecha_arribo: '2025-06-28'
        },
        {
          naviera: 'BajaFerries',
          buque: 'Mexico Star',
          destino: 'Mazatlán',
          muelle: 'Muelle 2',
          atraque: 'B-4',
          estatus: 'Atracado',
          hora: '17:50:00',
          fecha_arribo: '2025-06-28'
        },
        {
          naviera: 'TMC',
          buque: 'Santa Rita',
          destino: 'Mazatlán',
          muelle: 'Muelle 1',
          atraque: 'A-5',
          estatus: 'Listo',
          hora: '21:10:00',
          fecha_arribo: '2025-06-28'
        },
        {
          naviera: 'BajaFerries',
          buque: 'California Star',
          destino: 'Topolobampo',
          muelle: 'Muelle 3',
          atraque: 'B-5',
          estatus: 'Programado',
          hora: '23:30:00',
          fecha_arribo: '2025-06-28'
        }
      ],
      salidas: [
        {
          naviera: 'BajaFerries',
          buque: 'Cabo Star',
          destino: 'Mazatlán',
          muelle: 'Muelle 2',
          atraque: 'C-1',
          estatus: 'Programado',
          hora: '09:00:00',
          fecha_salida: '2025-06-28'
        },
        {
          naviera: 'TMC',
          buque: 'Santa Rita',
          destino: 'Topolobampo',
          muelle: 'Muelle 1',
          atraque: 'A-1',
          estatus: 'Embarcando',
          hora: '11:30:00',
          fecha_salida: '2025-06-28'
        },
        {
          naviera: 'BajaFerries',
          buque: 'Mexico Star',
          destino: 'Mazatlán',
          muelle: 'Muelle 3',
          atraque: 'C-2',
          estatus: 'Listo',
          hora: '15:45:00',
          fecha_salida: '2025-06-28'
        },
        {
          naviera: 'TMC',
          buque: 'San Jorge',
          destino: 'Topolobampo',
          muelle: 'Muelle 2',
          atraque: 'A-3',
          estatus: 'Programado',
          hora: '20:15:00',
          fecha_salida: '2025-06-28'
        },
        {
          naviera: 'BajaFerries',
          buque: 'California Star',
          destino: 'Mazatlán',
          muelle: 'Muelle 1',
          atraque: 'C-3',
          estatus: 'En tránsito',
          hora: '06:45:00',
          fecha_salida: '2025-06-28'
        },
        {
          naviera: 'TMC',
          buque: 'Santa Rita',
          destino: 'Mazatlán',
          muelle: 'Muelle 3',
          atraque: 'A-4',
          estatus: 'Confirmado',
          hora: '12:20:00',
          fecha_salida: '2025-06-28'
        },
        {
          naviera: 'BajaFerries',
          buque: 'Cabo Star',
          destino: 'Topolobampo',
          muelle: 'Muelle 2',
          atraque: 'C-4',
          estatus: 'Embarcando',
          hora: '18:00:00',
          fecha_salida: '2025-06-28'
        },
        {
          naviera: 'TMC',
          buque: 'San Jorge',
          destino: 'Mazatlán',
          muelle: 'Muelle 1',
          atraque: 'A-5',
          estatus: 'Listo',
          hora: '22:30:00',
          fecha_salida: '2025-06-28'
        },
        {
          naviera: 'BajaFerries',
          buque: 'Mexico Star',
          destino: 'Topolobampo',
          muelle: 'Muelle 3',
          atraque: 'C-5',
          estatus: 'Programado',
          hora: '05:15:00',
          fecha_salida: '2025-06-28'
        },
        {
          naviera: 'TMC',
          buque: 'Santa Rita',
          destino: 'Topolobampo',
          muelle: 'Muelle 2',
          atraque: 'A-6',
          estatus: 'Confirmado',
          hora: '14:40:00',
          fecha_salida: '2025-06-28'
        }
      ]
    };
    
    // Insertar arribos
    for (const arribo of datosEjemplo.arribos) {
      await pool.execute(
        'INSERT INTO arribos (naviera, buque, destino, muelle, atraque, estatus, hora, fecha_arribo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [arribo.naviera, arribo.buque, arribo.destino, arribo.muelle, arribo.atraque, arribo.estatus, arribo.hora, arribo.fecha_arribo]
      );
    }
    
    // Insertar salidas
    for (const salida of datosEjemplo.salidas) {
      await pool.execute(
        'INSERT INTO salidas (naviera, buque, destino, muelle, atraque, estatus, hora, fecha_salida) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [salida.naviera, salida.buque, salida.destino, salida.muelle, salida.atraque, salida.estatus, salida.hora, salida.fecha_salida]
      );
    }
    
    res.json({ 
      success: true, 
      message: 'Datos de ejemplo insertados correctamente',
      totalArribos: datosEjemplo.arribos.length,
      totalSalidas: datosEjemplo.salidas.length
    });
    
  } catch (error) {
    console.error('❌ Error insertando datos de ejemplo:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// 📊 ENDPOINT: Paginación avanzada para tablas
app.get('/api/buques-paginado', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      naviera = '', 
      ruta = '', 
      tipo = 'ambos',
      sortBy = 'hora',
      sortOrder = 'asc'
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    let params = [];
    
    if (naviera) {
      whereClause += ' AND naviera = ?';
      params.push(naviera);
    }
    
    if (ruta) {
      whereClause += ' AND destino = ?';
      params.push(ruta);
    }
    
    const orderClause = `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    
    let data = { arribos: [], salidas: [], total: 0 };
    
    if (tipo === 'arribos' || tipo === 'ambos') {
      const [arribos] = await pool.execute(
        `SELECT naviera, buque, destino, muelle, atraque, estatus, hora, fecha_arribo 
         FROM arribos ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), offset]
      );
      
      const [countArribos] = await pool.execute(
        `SELECT COUNT(*) as total FROM arribos ${whereClause}`,
        params
      );
      
      data.arribos = arribos;
      data.totalArribos = countArribos[0].total;
    }
    
    if (tipo === 'salidas' || tipo === 'ambos') {
      const [salidas] = await pool.execute(
        `SELECT naviera, buque, destino, muelle, atraque, estatus, hora, fecha_salida 
         FROM salidas ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), offset]
      );
      
      const [countSalidas] = await pool.execute(
        `SELECT COUNT(*) as total FROM salidas ${whereClause}`,
        params
      );
      
      data.salidas = salidas;
      data.totalSalidas = countSalidas[0].total;
    }
    
    data.currentPage = parseInt(page);
    data.itemsPerPage = parseInt(limit);
    data.totalPages = Math.ceil(Math.max(data.totalArribos || 0, data.totalSalidas || 0) / limit);
    
    res.json(data);
    
  } catch (error) {
    console.error('❌ Error en paginación:', error.message);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// 🌎 ENDPOINT: Obtener todos los destinos
app.get('/api/destinos', async (req, res) => {
  try {
    const [destinos] = await pool.execute(`
      SELECT id, nombre, codigo, tipo, ubicacion, activo 
      FROM destinos 
      WHERE activo = 1 
      ORDER BY nombre
    `);
    
    res.json({
      success: true,
      destinos: destinos,
      total: destinos.length
    });
  } catch (err) {
    console.error('❌ Error en /api/destinos:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🚢 ENDPOINT: Obtener todas las navieras
app.get('/api/navieras', async (req, res) => {
  try {
    const [navieras] = await pool.execute(`
      SELECT id, nombre, codigo, logo_url, activo 
      FROM navieras 
      WHERE activo = 1 
      ORDER BY nombre
    `);
    
    res.json({
      success: true,
      navieras: navieras,
      total: navieras.length
    });
  } catch (err) {
    console.error('❌ Error en /api/navieras:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ⛵ ENDPOINT: Obtener todos los buques
app.get('/api/buques-catalogo', async (req, res) => {
  try {
    const [buques] = await pool.execute(`
      SELECT b.id, b.nombre, b.tipo, b.capacidad_pasajeros, 
             b.capacidad_vehiculos, b.eslora, b.manga,
             n.nombre as naviera_nombre, n.codigo as naviera_codigo,
             n.logo_url as naviera_logo
      FROM buques b
      LEFT JOIN navieras n ON b.naviera_id = n.id
      WHERE b.activo = 1 
      ORDER BY n.nombre, b.nombre
    `);
    
    res.json({
      success: true,
      buques: buques,
      total: buques.length
    });
  } catch (err) {
    console.error('❌ Error en /api/buques-catalogo:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📋 ENDPOINT: Operaciones completas con información detallada
app.get('/api/operaciones-completas', async (req, res) => {
  try {
    const [arribos] = await pool.execute(`
      SELECT 'Arribo' as tipo_operacion, 
             naviera_nombre, naviera_codigo, naviera_logo,
             buque_nombre, buque_tipo,
             destino_nombre, destino_codigo,
             muelle, atraque, estatus, hora, fecha_arribo as fecha_operacion
      FROM vista_arribos_completa
      ORDER BY fecha_arribo DESC, hora ASC
      LIMIT 10
    `);
    
    const [salidas] = await pool.execute(`
      SELECT 'Salida' as tipo_operacion,
             naviera_nombre, naviera_codigo, naviera_logo,
             buque_nombre, buque_tipo,
             destino_nombre, destino_codigo,
             muelle, atraque, estatus, hora, fecha_salida as fecha_operacion
      FROM vista_salidas_completa
      ORDER BY fecha_salida DESC, hora ASC
      LIMIT 10
    `);
    
    // Combinar arribos y salidas
    const operaciones = [...arribos, ...salidas].sort((a, b) => {
      if (a.fecha_operacion === b.fecha_operacion) {
        return a.hora.localeCompare(b.hora);
      }
      return b.fecha_operacion.localeCompare(a.fecha_operacion);
    });
    
    res.json({
      success: true,
      operaciones: operaciones,
      total: operaciones.length,
      arribos: arribos.length,
      salidas: salidas.length
    });
  } catch (err) {
    console.error('❌ Error en /api/operaciones-completas:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🎯 ENDPOINT: Filtrar operaciones por destino
app.get('/api/operaciones-por-destino/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    
    const [arribos] = await pool.execute(`
      SELECT 'Arribo' as tipo_operacion, 
             naviera_nombre, buque_nombre, destino_nombre,
             muelle, atraque, estatus, hora, fecha_arribo as fecha_operacion
      FROM vista_arribos_completa
      WHERE destino_codigo = ?
      ORDER BY fecha_arribo DESC, hora ASC
    `, [codigo]);
    
    const [salidas] = await pool.execute(`
      SELECT 'Salida' as tipo_operacion,
             naviera_nombre, buque_nombre, destino_nombre,
             muelle, atraque, estatus, hora, fecha_salida as fecha_operacion
      FROM vista_salidas_completa
      WHERE destino_codigo = ?
      ORDER BY fecha_salida DESC, hora ASC
    `, [codigo]);
    
    res.json({
      success: true,
      destino_codigo: codigo,
      arribos: arribos,
      salidas: salidas,
      total: arribos.length + salidas.length
    });
  } catch (err) {
    console.error('❌ Error en /api/operaciones-por-destino:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ API para datos del dashboard principal
app.get('/api/dashboard-data', async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Obtener métricas básicas
    const [arribosResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM arribos WHERE DATE(fecha_arribo) = ?',
      [hoy]
    );
    
    const [salidasResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM salidas WHERE DATE(fecha_salida) = ?',
      [hoy]
    );
    
    // Contar embarcaciones activas (simplificado)
    const [embarcacionesResult] = await pool.execute(`
      SELECT COUNT(DISTINCT buque) as count FROM (
        SELECT buque FROM arribos WHERE DATE(fecha_arribo) = ?
        UNION
        SELECT buque FROM salidas WHERE DATE(fecha_salida) = ?
      ) buques_activos
    `, [hoy, hoy]);
    
    // Obtener operaciones recientes
    const [operacionesRecientes] = await pool.execute(`
      (SELECT 'arribo' as tipo, buque, naviera, destino, hora, fecha_arribo as fecha
       FROM arribos WHERE DATE(fecha_arribo) = ? ORDER BY fecha_arribo DESC, hora DESC LIMIT 5)
      UNION ALL
      (SELECT 'salida' as tipo, buque, naviera, destino, hora, fecha_salida as fecha
       FROM salidas WHERE DATE(fecha_salida) = ? ORDER BY fecha_salida DESC, hora DESC LIMIT 5)
      ORDER BY fecha DESC, hora DESC LIMIT 10
    `, [hoy, hoy]);
    
    // Formatear operaciones para el frontend
    const recentOperations = operacionesRecientes.map(op => ({
      icon: op.tipo === 'arribo' ? '🚢' : '⛵',
      title: `${op.tipo === 'arribo' ? 'Arribo' : 'Salida'}: ${op.buque} (${op.naviera})`,
      subtitle: `Destino: ${op.destino}`,
      timestamp: new Date(`${op.fecha} ${op.hora}`).toISOString()
    }));
    
    res.json({
      arrivals: arribosResult[0].count,
      departures: salidasResult[0].count,
      vessels: embarcacionesResult[0].count,
      recentOperations: recentOperations,
      lastUpdate: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo datos del dashboard:', error.message);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      arrivals: 0,
      departures: 0,
      vessels: 0,
      recentOperations: []
    });
  }
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  🚢 ====================================
     TERMINAL DOS - Puerto La Paz
  ====================================
  
  ✅ Servidor ejecutándose en puerto ${PORT}
  🌐 Accede a: http://localhost:${PORT}
  
  📊 Dashboard: http://localhost:${PORT}/dashboard.html
  📋 Operaciones: http://localhost:${PORT}/app.html
  📄 Índice: http://localhost:${PORT}/index.html
  
  🔗 API Endpoints:
     • GET  /api/buques (datos básicos)
     • GET  /api/buques-paginado (paginación avanzada)
     • GET  /api/metricas-dia (métricas dashboard)
     • POST /api/datos-ejemplo (cargar datos de prueba)
     • GET  /reset-db (restaurar base de datos)
  
  ⚡ Listo para manejar operaciones marítimas!
  ====================================
  `);
});
