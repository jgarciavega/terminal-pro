# Terminal Dos - Sistema de Gestión de Buques

![Terminal Dos](public/imagenes/GBCS.png)

**Terminal Dos** es una aplicación de escritorio desarrollada con Electron y Express para la gestión y visualización de arribos y salidas de buques en terminales portuarios.

## 🚀 Inicio Rápido

### Opción 1: Acceso Directo (Recomendado)
1. Ejecuta el script para crear un acceso directo en el escritorio:
   ```powershell
   .\Create-Desktop-Shortcut.ps1
   ```
2. Haz doble clic en el acceso directo "Terminal Dos" en tu escritorio

### Opción 2: Archivos de Arranque
- **Arranque con información**: Doble clic en `Terminal-Dos.bat`
- **Arranque silencioso**: Doble clic en `Terminal-Dos-Silent.bat`
- **PowerShell**: Ejecuta `.\Terminal-Dos.ps1`

### Opción 3: Línea de Comandos
```bash
node start-app-improved.js
```

## 📋 Requisitos del Sistema

- **Node.js** 16 o superior
- **MySQL** 5.7 o superior
- **Windows** 10 o superior
- **pnpm** o **npm** (para gestión de dependencias)

## 🗄️ Configuración de Base de Datos

La aplicación utiliza una base de datos MySQL local llamada `buquesbd`. 

### Configuración Automática
Al ejecutar la aplicación por primera vez, se verificará y creará automáticamente:
- La base de datos `buquesbd`
- Las tablas necesarias (`barcos_entrada`, `barcos_salida`)

### Configuración Manual
Si necesitas configurar manualmente:

1. **Crear la base de datos**:
   ```bash
   node create-bd.js
   ```

2. **Verificar la configuración**:
   ```bash
   node check-db.js
   ```

### Variables de Entorno
El archivo `.env` contiene la configuración de la base de datos:
```env
DB_HOST=localhost
DB_USER=jorge
DB_PASSWORD=
DB_NAME=buquesbd
DB_PORT=3306
```

## 🏗️ Estructura del Proyecto

```
terminalDos/
├── api/
│   └── server.js          # Servidor Express (API backend)
├── public/
│   ├── index.html         # Interfaz principal
│   ├── styles.css         # Estilos CSS
│   └── horarios/
│       └── principal.js   # Lógica del frontend
├── src/
│   ├── mysql.js          # Configuración de MySQL
│   └── database/
│       └── conexion.js   # Conexión a la base de datos
├── main.js               # Aplicación Electron principal
├── start-app-improved.js # Script mejorado de inicio
└── package.json          # Configuración del proyecto
```

## 🔧 Funcionalidades

### 📊 Vista Principal
- **Tabla de Arribos**: Visualización de barcos que llegan al terminal
- **Tabla de Salidas**: Visualización de barcos que salen del terminal
- **Actualización Automática**: Los datos se actualizan automáticamente cada 30 segundos
- **Interfaz Responsiva**: Diseño adaptable a diferentes tamaños de pantalla

### 🔄 Gestión de Datos
- **API REST**: Endpoints para obtener datos de arribos y salidas
- **Base de Datos MySQL**: Almacenamiento persistente de información
- **Validación de Datos**: Verificación de integridad de la información

### 🖥️ Interfaz de Usuario
- **Aplicación de Escritorio**: Funciona como aplicación nativa de Windows
- **Diseño Moderno**: Interfaz limpia y profesional
- **Navegación Intuitiva**: Fácil de usar para usuarios finales

## 🛠️ Desarrollo

### Instalación de Dependencias
```bash
npm install
# o
pnpm install
```

### Scripts Disponibles
```bash
# Desarrollo
npm run dev
pnpm dev

# Producción
npm start
pnpm start

# Inicio seguro (recomendado)
npm run app-safe
pnpm app-safe
```

### Estructura de la Base de Datos

#### Tabla: `barcos_entrada`
- `id`: ID único del registro
- `nombre_barco`: Nombre del barco
- `procedencia`: Puerto de origen
- `eta`: Tiempo estimado de arribo
- `otros campos`: Información adicional del barco

#### Tabla: `barcos_salida`
- `id`: ID único del registro
- `nombre_barco`: Nombre del barco
- `destino`: Puerto de destino
- `etd`: Tiempo estimado de salida
- `otros campos`: Información adicional del barco

## 📝 Logs y Debugging

La aplicación genera logs informativos durante la ejecución:
- ✅ Inicio exitoso de componentes
- ⚠️ Advertencias de configuración
- ❌ Errores de conexión o funcionamiento
- 📊 Estado de la base de datos

## 🚨 Solución de Problemas

### Error: "Puerto 3000 ya está en uso"
La aplicación detecta y termina automáticamente procesos conflictivos en el puerto 3000.

### Error: "No se puede conectar a MySQL"
1. Verifica que MySQL esté ejecutándose
2. Revisa las credenciales en el archivo `.env`
3. Ejecuta `node check-db.js` para verificar la conexión

### Error: "Dependencias no instaladas"
Los scripts de arranque instalan automáticamente las dependencias faltantes.

### La aplicación no inicia
1. Verifica que Node.js esté instalado: `node --version`
2. Usa el arranque con información: `Terminal-Dos.bat`
3. Revisa los logs en la consola para identificar el problema

## 📞 Soporte

Para soporte técnico o reportar problemas:
1. Revisa los logs de la aplicación
2. Verifica la configuración de la base de datos
3. Consulta la documentación del proyecto

---

**Terminal Dos** - Sistema profesional de gestión portuaria desarrollado con tecnologías web modernas.
