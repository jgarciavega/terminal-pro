# Configuración de la API del Clima 🌤️

## OpenWeatherMap API

Para obtener datos de clima en tiempo real, necesitas configurar una API key de OpenWeatherMap.

### 📝 Pasos para obtener la API Key:

1. **Registrarse en OpenWeatherMap**
   - Ve a [https://openweathermap.org/api](https://openweathermap.org/api)
   - Haz clic en "Sign Up" (es gratuito)
   - Completa el formulario de registro

2. **Obtener la API Key**
   - Una vez registrado, ve a tu perfil
   - Sección "API Keys"
   - Copia tu API key

3. **Configurar en el proyecto**
   - Abre el archivo `.env`
   - Reemplaza `tu_api_key_aqui` con tu API key real:
   ```
   WEATHER_API_KEY=tu_api_key_real_aqui
   ```

### 🆓 Plan Gratuito

El plan gratuito de OpenWeatherMap incluye:
- ✅ 1,000 llamadas por día
- ✅ Datos actuales del clima
- ✅ Pronóstico a 5 días
- ✅ Más que suficiente para este proyecto

### 🔄 Funcionamiento

- **Con API configurada**: Datos reales del clima de La Paz, Mazatlán y Topolobampo
- **Sin API configurada**: El sistema usa datos mock (simulados) automáticamente

### 📍 Ubicaciones

El sistema obtiene datos para estos puertos:
- **La Paz, BCS**: 24.1426°N, 110.3128°W
- **Mazatlán, SIN**: 23.2494°N, 106.4103°W  
- **Topolobampo, SIN**: 25.5948°N, 109.0543°W

### 🔧 Troubleshooting

Si hay problemas con la API:
- Verifica que la API key sea correcta
- Revisa que no hayas excedido el límite de llamadas
- El sistema automáticamente usará datos mock como respaldo

### 📊 Datos que proporciona

- Temperatura actual
- Condiciones del clima (despejado, nublado, lluvia, etc.)
- Velocidad y dirección del viento
- Humedad relativa
- Presión atmosférica
- Visibilidad
- Estimación de altura de olas
- Status de navegación (favorable/precaución/desfavorable)
