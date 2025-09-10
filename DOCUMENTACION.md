# Terminal Pro - Sistema de Control de Arribos y Zarpes

## Descripción
Sistema completo de gestión portuaria que permite el control y seguimiento de arribos y zarpes de buques, con información meteorológica en tiempo real y estadísticas operacionales.

## Funcionalidades Implementadas

### 1. Mostrar Horarios de Barcos
- **En Puerto**: Muestra buques actualmente atracados en el puerto
- **En Tránsito**: Visualiza buques en ruta hacia el puerto
- **Otro Puerto**: Lista buques ubicados en otros puertos

### 2. Estado del Tiempo en Tiempo Real
- Temperatura actual y sensación térmica
- Condiciones meteorológicas y visibilidad
- Información de viento (velocidad y dirección)
- Humedad y presión atmosférica

### 3. Información del Giro (Estadísticas Operacionales)
- Contador de buques en puerto
- Cantidad de embarcaciones en tránsito
- Total de operaciones diarias
- Próximos arribos programados

## Estructura de Archivos
- `index.html`: Estructura principal de la aplicación
- `styles.css`: Estilos y diseño responsivo
- `script.js`: Lógica de la aplicación y manejo de datos

## Características Técnicas
- **Interfaz Responsiva**: Adaptable a diferentes dispositivos
- **Filtrado Dinámico**: Filtros por estado de buques
- **Actualización Automática**: Refresh de datos meteorológicos cada 5 minutos
- **Diseño Moderno**: Interfaz profesional con iconos FontAwesome

## Uso
1. Abrir `index.html` en un navegador web
2. Usar los botones de filtro para ver buques por estado
3. Revisar información meteorológica y estadísticas en tiempo real

## Datos de Ejemplo
El sistema incluye datos de demostración con 6 buques de diferentes tipos:
- Cargueros y portacontenedores
- Petroleros y graneleros
- Cruceros y pesqueros
- Diferentes banderas y compañías navieras

## Futuras Mejoras
- Integración con API meteorológica real
- Base de datos para persistencia de datos
- Sistema de notificaciones
- Módulo de reportes
- Gestión de usuarios y permisos