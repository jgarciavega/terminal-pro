const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// =============================
// 🔧 MIDDLEWARE
// =============================
app.use(express.json());
app.use(cors());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// =============================
// 📊 DATOS MOCK PARA DESARROLLO
// =============================

// Datos de ejemplo para desarrollo
const mockData = {
  arribos: [
    {
      id: 1,
      naviera: "BAJA FERRIES",
      buque: "Santa Rita",
      origen: "Mazatlán",
      hora: "08:30:00",
      estado: "Confirmado",
      muelle: "A-1",
      pasajeros: 450,
      vehiculos: 120
    },
    {
      id: 2,
      naviera: "TMC",
      buque: "Mexico Star",
      origen: "Topolobampo",
      hora: "14:15:00",
      estado: "En tránsito",
      muelle: "B-2",
      pasajeros: 320,
      vehiculos: 85
    },
    {
      id: 3,
      naviera: "BAJA FERRIES",
      buque: "San Jorge",
      origen: "Mazatlán",
      hora: "16:45:00",
      estado: "Atracado",
      muelle: "A-1",
      pasajeros: 380,
      vehiculos: 95
    },
    {
      id: 4,
      naviera: "TMC",
      buque: "California Star",
      origen: "Topolobampo",
      hora: "19:30:00",
      estado: "En tránsito",
      muelle: "B-1",
      pasajeros: 290,
      vehiculos: 70
    },
    {
      id: 5,
      naviera: "BAJA FERRIES",
      buque: "Cabo Star",
      origen: "Mazatlán",
      hora: "10:45:00",
      estado: "Confirmado",
      muelle: "A-2",
      pasajeros: 410,
      vehiculos: 110
    }
  ],
  
  salidas: [
    {
      id: 1,
      naviera: "BAJA FERRIES",
      buque: "Santa Rita",
      destino: "Topolobampo",
      hora: "11:30:00",
      estado: "Embarcando",
      muelle: "A-1",
      pasajeros: 380,
      vehiculos: 95
    },
    {
      id: 2,
      naviera: "TMC",
      buque: "Mexico Star",
      destino: "Mazatlán",
      hora: "15:45:00",
      estado: "Listo",
      muelle: "B-2",
      pasajeros: 420,
      vehiculos: 105
    },
    {
      id: 3,
      naviera: "BAJA FERRIES",
      buque: "San Jorge",
      destino: "Topolobampo",
      hora: "20:15:00",
      estado: "Programado",
      muelle: "A-1",
      pasajeros: 350,
      vehiculos: 80
    },
    {
      id: 4,
      naviera: "TMC",
      buque: "Cabo Star",
      destino: "Topolobampo",
      hora: "18:00:00",
      estado: "Embarcando",
      muelle: "A-2",
      pasajeros: 290,
      vehiculos: 75
    },
    {
      id: 5,
      naviera: "BAJA FERRIES",
      buque: "Santa Rita",
      destino: "Topolobampo",
      hora: "14:40:00",
      estado: "Confirmado",
      muelle: "A-1",
      pasajeros: 460,
      vehiculos: 125
    }
  ],

  clima: {
    lapaz: {
      temperatura: 28,
      condicion: "Soleado",
      icono: "☀️",
      viento: "15 km/h NE",
      humedad: "65%",
      oleaje: "0.8m",
      visibilidad: "15 km",
      status: "favorable"
    },
    mazatlan: {
      temperatura: 32,
      condicion: "Parcialmente nublado",
      icono: "⛅",
      viento: "12 km/h E",
      humedad: "70%",
      oleaje: "1.2m",
      visibilidad: "12 km",
      status: "acceptable"
    },
    topolobampo: {
      temperatura: 30,
      condicion: "Despejado",
      icono: "🌤️",
      viento: "18 km/h NW",
      humedad: "60%",
      oleaje: "0.5m",
      visibilidad: "18 km",
      status: "favorable"
    }
  },

  metricas: {
    arribos_hoy: 12,
    salidas_hoy: 8,
    rutas_activas: 3,
    buques_puerto: 5,
    pasajeros_total: 1850,
    vehiculos_total: 485
  }
};

// =============================
// 🌐 RUTAS DE API
// =============================

// Ruta principal - Dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard-nuevo.html'));
});

// API - Datos de arribos
app.get('/api/arribos', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.arribos,
      timestamp: new Date().toISOString(),
      total: mockData.arribos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener arribos',
      message: error.message
    });
  }
});

// API - Datos de salidas
app.get('/api/salidas', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.salidas,
      timestamp: new Date().toISOString(),
      total: mockData.salidas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener salidas',
      message: error.message
    });
  }
});

// API - Datos del clima
app.get('/api/clima', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.clima,
      timestamp: new Date().toISOString(),
      ultima_actualizacion: new Date().toLocaleString('es-MX')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos del clima',
      message: error.message
    });
  }
});

// API - Clima específico por puerto
app.get('/api/clima/:puerto', (req, res) => {
  try {
    const puerto = req.params.puerto.toLowerCase();
    const climaPuerto = mockData.clima[puerto];
    
    if (!climaPuerto) {
      return res.status(404).json({
        success: false,
        error: 'Puerto no encontrado',
        available_ports: Object.keys(mockData.clima)
      });
    }

    res.json({
      success: true,
      puerto: puerto,
      data: climaPuerto,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener clima del puerto',
      message: error.message
    });
  }
});

// API - Métricas del dashboard
app.get('/api/metricas', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.metricas,
      timestamp: new Date().toISOString(),
      fecha: new Date().toLocaleDateString('es-MX')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener métricas',
      message: error.message
    });
  }
});

// API - Estado general del sistema
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    version: '1.0.0',
    servidor: 'Terminal Dos API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoria_uso: process.memoryUsage()
  });
});

// API - Información completa del dashboard
app.get('/api/dashboard', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        arribos: mockData.arribos.slice(0, 5), // Últimos 5
        salidas: mockData.salidas.slice(0, 5),  // Últimos 5
        clima: mockData.clima,
        metricas: mockData.metricas
      },
      timestamp: new Date().toISOString(),
      servidor: 'Terminal Dos Dashboard API v1.0'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos del dashboard',
      message: error.message
    });
  }
});

// =============================
// 🚀 INICIAR SERVIDOR
// =============================

app.listen(PORT, () => {
  console.log(`
  🌊 ================================== 🌊
     TERMINAL DOS DASHBOARD SERVIDOR
  🌊 ================================== 🌊
  
  ✅ Servidor iniciado exitosamente
  🌐 URL: http://localhost:${PORT}
  📊 Dashboard: http://localhost:${PORT}/
  🔗 API Status: http://localhost:${PORT}/api/status
  📈 API Dashboard: http://localhost:${PORT}/api/dashboard
  
  📱 APIs disponibles:
  • /api/arribos      - Datos de arribos
  • /api/salidas      - Datos de salidas  
  • /api/clima        - Clima de todos los puertos
  • /api/clima/{puerto} - Clima específico
  • /api/metricas     - Métricas del dashboard
  • /api/dashboard    - Datos completos
  
  🎯 Listo para recibir conexiones...
  `);
});

// Manejo de errores
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});
