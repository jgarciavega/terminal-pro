// =============================
// 🌊 TERMINAL DOS - API CLIENT
// =============================

class TerminalDosAPI {
  constructor() {
    this.baseURL = window.location.origin;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // Método genérico para llamadas API
  async fetchAPI(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}/api${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ Error en API ${endpoint}:`, error);
      throw error;
    }
  }

  // Cache simple para evitar llamadas innecesarias
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCached(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // =============================
  // 📊 MÉTODOS DE API
  // =============================

  async getArribos() {
    const cached = this.getCached('arribos');
    if (cached) return cached;

    try {
      const response = await this.fetchAPI('/arribos');
      this.setCached('arribos', response);
      return response;
    } catch (error) {
      console.warn('Usando datos mock para arribos');
      return this.getMockArribos();
    }
  }

  async getSalidas() {
    const cached = this.getCached('salidas');
    if (cached) return cached;

    try {
      const response = await this.fetchAPI('/salidas');
      this.setCached('salidas', response);
      return response;
    } catch (error) {
      console.warn('Usando datos mock para salidas');
      return this.getMockSalidas();
    }
  }

  async getClima(puerto = null) {
    const cacheKey = puerto ? `clima_${puerto}` : 'clima_all';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const endpoint = puerto ? `/clima/${puerto}` : '/clima';
      const response = await this.fetchAPI(endpoint);
      this.setCached(cacheKey, response);
      return response;
    } catch (error) {
      console.warn('Usando datos mock para clima');
      return this.getMockClima(puerto);
    }
  }

  async getMetricas() {
    const cached = this.getCached('metricas');
    if (cached) return cached;

    try {
      const response = await this.fetchAPI('/metricas');
      this.setCached('metricas', response);
      return response;
    } catch (error) {
      console.warn('Usando datos mock para métricas');
      return this.getMockMetricas();
    }
  }

  async getDashboardCompleto() {
    try {
      return await this.fetchAPI('/dashboard');
    } catch (error) {
      console.warn('Error al obtener dashboard completo, usando APIs individuales');
      const [arribos, salidas, clima, metricas] = await Promise.allSettled([
        this.getArribos(),
        this.getSalidas(), 
        this.getClima(),
        this.getMetricas()
      ]);

      return {
        success: true,
        data: {
          arribos: arribos.status === 'fulfilled' ? arribos.value.data : [],
          salidas: salidas.status === 'fulfilled' ? salidas.value.data : [],
          clima: clima.status === 'fulfilled' ? clima.value.data : {},
          metricas: metricas.status === 'fulfilled' ? metricas.value.data : {}
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  async getStatus() {
    try {
      return await this.fetchAPI('/status');
    } catch (error) {
      return {
        success: false,
        status: 'offline',
        error: error.message
      };
    }
  }

  // =============================
  // 🔄 DATOS MOCK DE RESPALDO
  // =============================

  getMockArribos() {
    return {
      success: true,
      data: [
        {
          naviera: "BAJA FERRIES",
          buque: "Santa Rita", 
          origen: "Mazatlán",
          hora: "08:30:00",
          estado: "Confirmado"
        },
        {
          naviera: "TMC",
          buque: "Mexico Star",
          origen: "Topolobampo", 
          hora: "14:15:00",
          estado: "En tránsito"
        }
      ],
      timestamp: new Date().toISOString(),
      source: 'mock'
    };
  }

  getMockSalidas() {
    return {
      success: true,
      data: [
        {
          naviera: "BAJA FERRIES",
          buque: "San Jorge",
          destino: "Topolobampo",
          hora: "11:30:00", 
          estado: "Embarcando"
        },
        {
          naviera: "TMC",
          buque: "Cabo Star",
          destino: "Mazatlán",
          hora: "15:45:00",
          estado: "Listo"
        }
      ],
      timestamp: new Date().toISOString(),
      source: 'mock'
    };
  }

  getMockClima(puerto) {
    const climaData = {
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
    };

    return {
      success: true,
      data: puerto ? climaData[puerto] : climaData,
      timestamp: new Date().toISOString(),
      source: 'mock'
    };
  }

  getMockMetricas() {
    return {
      success: true,
      data: {
        arribos_hoy: 12,
        salidas_hoy: 8,
        rutas_activas: 3,
        buques_puerto: 5
      },
      timestamp: new Date().toISOString(),
      source: 'mock'
    };
  }

  // =============================
  // 🔄 UTILIDADES
  // =============================

  clearCache() {
    this.cache.clear();
    console.log('✅ Cache limpiado');
  }

  getCacheStats() {
    return {
      entries: this.cache.size,
      keys: Array.from(this.cache.keys()),
      lastUpdate: this.cache.size > 0 ? Math.max(...Array.from(this.cache.values()).map(c => c.timestamp)) : null
    };
  }
}

// Instancia global
window.terminalAPI = new TerminalDosAPI();

// Hacer disponibles las funciones principales globalmente
window.fetchArribos = () => window.terminalAPI.getArribos();
window.fetchSalidas = () => window.terminalAPI.getSalidas();
window.fetchClima = (puerto) => window.terminalAPI.getClima(puerto);
window.fetchMetricas = () => window.terminalAPI.getMetricas();
window.fetchDashboard = () => window.terminalAPI.getDashboardCompleto();

console.log('🌊 Terminal Dos API Client inicializado');
console.log('📡 APIs disponibles:', {
  getArribos: 'terminalAPI.getArribos()',
  getSalidas: 'terminalAPI.getSalidas()',
  getClima: 'terminalAPI.getClima(puerto)',
  getMetricas: 'terminalAPI.getMetricas()',
  getDashboard: 'terminalAPI.getDashboardCompleto()'
});
