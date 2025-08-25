import axios from 'axios';

class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.apiUrl = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';
    
    // Coordenadas de los puertos
    this.puertos = {
      lapaz: { lat: 24.1426, lon: -110.3128, name: 'La Paz, BCS' },
      mazatlan: { lat: 23.2494, lon: -106.4103, name: 'Mazatlán, SIN' },
      topolobampo: { lat: 25.5948, lon: -109.0543, name: 'Topolobampo, SIN' }
    };
  }

  // Verificar si la API está configurada
  isConfigured() {
    return this.apiKey && this.apiKey !== 'tu_api_key_aqui';
  }

  // Obtener clima de un puerto específico
  async getWeatherByPort(puerto) {
    if (!this.isConfigured()) {
      throw new Error('API key no configurada');
    }

    const portData = this.puertos[puerto.toLowerCase()];
    if (!portData) {
      throw new Error(`Puerto no encontrado: ${puerto}`);
    }

    try {
      const response = await axios.get(`${this.apiUrl}/weather`, {
        params: {
          lat: portData.lat,
          lon: portData.lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'es'
        },
        timeout: 5000
      });

      return this.formatWeatherData(response.data, portData.name);
    } catch (error) {
      console.error(`Error obteniendo clima para ${puerto}:`, error.message);
      throw error;
    }
  }

  // Obtener clima de todos los puertos
  async getAllWeather() {
    if (!this.isConfigured()) {
      throw new Error('API key no configurada');
    }

    const results = {};
    
    for (const [puerto, data] of Object.entries(this.puertos)) {
      try {
        results[puerto] = await this.getWeatherByPort(puerto);
      } catch (error) {
        console.error(`Error obteniendo clima para ${puerto}:`, error.message);
        // En caso de error, usar datos mock para ese puerto
        results[puerto] = this.getMockWeather(puerto);
      }
    }

    return results;
  }

  // Formatear datos de la API a nuestro formato
  formatWeatherData(apiData, locationName) {
    const temp = Math.round(apiData.main.temp);
    const windSpeed = Math.round(apiData.wind.speed * 3.6); // m/s a km/h
    const windDir = this.getWindDirection(apiData.wind.deg);
    
    // Mapear condiciones a iconos
    const conditionMap = {
      'clear sky': { icon: '☀️', condition: 'Despejado' },
      'few clouds': { icon: '🌤️', condition: 'Pocas nubes' },
      'scattered clouds': { icon: '⛅', condition: 'Nubes dispersas' },
      'broken clouds': { icon: '☁️', condition: 'Nublado' },
      'shower rain': { icon: '🌦️', condition: 'Chubascos' },
      'rain': { icon: '🌧️', condition: 'Lluvia' },
      'thunderstorm': { icon: '⛈️', condition: 'Tormenta' },
      'snow': { icon: '🌨️', condition: 'Nieve' },
      'mist': { icon: '🌫️', condition: 'Niebla' }
    };

    const weather = conditionMap[apiData.weather[0].description] || 
                   { icon: '🌤️', condition: apiData.weather[0].description };

    // Determinar status navegable
    const status = this.getNavigationStatus(windSpeed, apiData.visibility);

    return {
      temperatura: temp,
      condicion: weather.condition,
      icono: weather.icon,
      viento: `${windSpeed} km/h ${windDir}`,
      humedad: `${apiData.main.humidity}%`,
      presion: `${apiData.main.pressure} hPa`,
      visibilidad: `${Math.round(apiData.visibility / 1000)} km`,
      oleaje: this.estimateWaveHeight(windSpeed),
      status: status,
      location: locationName,
      timestamp: new Date().toISOString(),
      source: 'OpenWeatherMap'
    };
  }

  // Convertir grados a dirección del viento
  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  // Estimar altura de olas basado en velocidad del viento
  estimateWaveHeight(windSpeed) {
    if (windSpeed < 10) return '0.3-0.5m';
    if (windSpeed < 20) return '0.5-1.0m';
    if (windSpeed < 30) return '1.0-1.5m';
    if (windSpeed < 40) return '1.5-2.5m';
    return '2.5m+';
  }

  // Determinar status de navegación
  getNavigationStatus(windSpeed, visibility) {
    if (windSpeed > 35 || visibility < 1000) return 'desfavorable';
    if (windSpeed > 25 || visibility < 5000) return 'precaution';
    return 'favorable';
  }

  // Datos mock en caso de fallo de API
  getMockWeather(puerto) {
    const mockData = {
      lapaz: {
        temperatura: Math.floor(Math.random() * 10) + 25,
        condicion: "Soleado",
        icono: "☀️",
        viento: `${Math.floor(Math.random() * 10) + 10} km/h NE`,
        humedad: `${Math.floor(Math.random() * 20) + 60}%`,
        oleaje: `${(Math.random() * 1 + 0.5).toFixed(1)}m`,
        visibilidad: `${Math.floor(Math.random() * 10) + 10} km`,
        status: "favorable",
        source: "mock"
      },
      mazatlan: {
        temperatura: Math.floor(Math.random() * 8) + 28,
        condicion: "Parcialmente nublado",
        icono: "⛅",
        viento: `${Math.floor(Math.random() * 8) + 10} km/h E`,
        humedad: `${Math.floor(Math.random() * 15) + 65}%`,
        oleaje: `${(Math.random() * 0.8 + 0.8).toFixed(1)}m`,
        visibilidad: `${Math.floor(Math.random() * 8) + 10} km`,
        status: "acceptable",
        source: "mock"
      },
      topolobampo: {
        temperatura: Math.floor(Math.random() * 12) + 26,
        condicion: "Despejado",
        icono: "🌤️",
        viento: `${Math.floor(Math.random() * 12) + 15} km/h NW`,
        humedad: `${Math.floor(Math.random() * 15) + 55}%`,
        oleaje: `${(Math.random() * 0.6 + 0.3).toFixed(1)}m`,
        visibilidad: `${Math.floor(Math.random() * 12) + 15} km`,
        status: "favorable",
        source: "mock"
      }
    };

    return mockData[puerto] || mockData.lapaz;
  }
}

export default WeatherService;
