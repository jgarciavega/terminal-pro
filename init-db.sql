-- Script de inicialización para Terminal Dos - Puerto La Paz
-- Creación de base de datos y tablas para arribos y salidas

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS buquesbd;
USE buquesbd;

-- Tabla de arribos
CREATE TABLE IF NOT EXISTS arribos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naviera VARCHAR(50) NOT NULL,
  buque VARCHAR(100) NOT NULL,
  destino VARCHAR(100) NOT NULL,
  muelle VARCHAR(50),
  atraque VARCHAR(20),
  estatus VARCHAR(50) DEFAULT 'Programado',
  hora TIME NOT NULL,
  fecha_arribo DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_naviera (naviera),
  INDEX idx_fecha (fecha_arribo),
  INDEX idx_destino (destino)
);

-- Tabla de salidas
CREATE TABLE IF NOT EXISTS salidas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naviera VARCHAR(50) NOT NULL,
  buque VARCHAR(100) NOT NULL,
  destino VARCHAR(100) NOT NULL,
  muelle VARCHAR(50),
  atraque VARCHAR(20),
  estatus VARCHAR(50) DEFAULT 'Programado',
  hora TIME NOT NULL,
  fecha_salida DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_naviera (naviera),
  INDEX idx_fecha (fecha_salida),
  INDEX idx_destino (destino)
);

-- Tabla de buques maestros (opcional para futuras expansiones)
CREATE TABLE IF NOT EXISTS buques_maestros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naviera VARCHAR(50) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  codigo VARCHAR(10),
  capacidad_pasajeros INT,
  capacidad_vehiculos INT,
  estado VARCHAR(20) DEFAULT 'Activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_buque (naviera, nombre)
);

-- Insertar datos maestros de buques
INSERT IGNORE INTO buques_maestros (naviera, nombre, codigo, capacidad_pasajeros, capacidad_vehiculos) VALUES
('TMC', 'Santa Rita', 'SR', 1200, 200, 'Activo'),
('TMC', 'San Jorge', 'SJ', 1000, 180, 'Activo'),
('BajaFerries', 'Mexico Star', 'MS', 1500, 250, 'Activo'),
('BajaFerries', 'California Star', 'CS', 1300, 220, 'Activo'),
('BajaFerries', 'Cabo Star', 'CB', 1100, 190, 'Activo');

-- Tabla de rutas (opcional)
CREATE TABLE IF NOT EXISTS rutas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  origen VARCHAR(100) NOT NULL,
  destino VARCHAR(100) NOT NULL,
  distancia_km DECIMAL(8,2),
  tiempo_estimado TIME,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar rutas principales
INSERT IGNORE INTO rutas (origen, destino, distancia_km, tiempo_estimado) VALUES
('La Paz', 'Mazatlán', 375.5, '18:00:00'),
('Mazatlán', 'La Paz', 375.5, '18:00:00'),
('La Paz', 'Topolobampo', 225.3, '12:00:00'),
('Topolobampo', 'La Paz', 225.3, '12:00:00');

-- Crear vista para operaciones del día
CREATE OR REPLACE VIEW operaciones_hoy AS
SELECT 
  'Arribo' as tipo_operacion,
  naviera,
  buque,
  destino as ruta,
  hora,
  estatus,
  fecha_arribo as fecha,
  muelle,
  atraque
FROM arribos 
WHERE DATE(fecha_arribo) = CURDATE()
UNION ALL
SELECT 
  'Salida' as tipo_operacion,
  naviera,
  buque,
  destino as ruta,
  hora,
  estatus,
  fecha_salida as fecha,
  muelle,
  atraque
FROM salidas 
WHERE DATE(fecha_salida) = CURDATE()
ORDER BY hora;

-- Crear vista para estadísticas rápidas
CREATE OR REPLACE VIEW stats_diarias AS
SELECT 
  DATE(fecha) as fecha,
  COUNT(CASE WHEN tipo_operacion = 'Arribo' THEN 1 END) as total_arribos,
  COUNT(CASE WHEN tipo_operacion = 'Salida' THEN 1 END) as total_salidas,
  COUNT(CASE WHEN naviera = 'TMC' THEN 1 END) as ops_tmc,
  COUNT(CASE WHEN naviera = 'BajaFerries' THEN 1 END) as ops_bajaferries,
  COUNT(CASE WHEN ruta = 'Mazatlán' THEN 1 END) as ops_mazatlan,
  COUNT(CASE WHEN ruta = 'Topolobampo' THEN 1 END) as ops_topolobampo
FROM operaciones_hoy
GROUP BY DATE(fecha);

SELECT 'Base de datos inicializada correctamente para Terminal Dos - Puerto La Paz' as status;
