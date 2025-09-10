-- ================================================
-- SCRIPT DE BASE DE DATOS: BUQUESBD
-- Sistema de Información de Buques - Terminal Dos
-- Fecha: 26 de junio de 2025
-- Autor: Jorge Ignacio, Jazziel Briones
-- ================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `buquesbd` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos
USE `buquesbd`;

-- ================================================
-- TABLA: ARRIBOS (Llegadas de buques)
-- ================================================
DROP TABLE IF EXISTS `arribos`;

CREATE TABLE `arribos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naviera` varchar(100) NOT NULL COMMENT 'Nombre de la naviera',
  `buque` varchar(100) NOT NULL COMMENT 'Nombre del buque',
  `destino` varchar(100) NOT NULL COMMENT 'Puerto de destino',
  `muelle` varchar(50) NOT NULL COMMENT 'Número o nombre del muelle',
  `atraque` varchar(50) NOT NULL COMMENT 'Posición de atraque',
  `estatus` varchar(50) NOT NULL COMMENT 'Estado actual del buque',
  `hora` time NOT NULL COMMENT 'Hora programada de arribo',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro en el sistema',
  `fecha_arribo` date NULL COMMENT 'Fecha programada de arribo',
  PRIMARY KEY (`id`),
  KEY `idx_naviera` (`naviera`),
  KEY `idx_buque` (`buque`),
  KEY `idx_fecha_arribo` (`fecha_arribo`),
  KEY `idx_hora` (`hora`)
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabla de arribos/llegadas de buques al puerto';

-- ================================================
-- TABLA: SALIDAS (Partidas de buques)
-- ================================================
DROP TABLE IF EXISTS `salidas`;

CREATE TABLE `salidas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naviera` varchar(100) NOT NULL COMMENT 'Nombre de la naviera',
  `buque` varchar(100) NOT NULL COMMENT 'Nombre del buque',
  `destino` varchar(100) NOT NULL COMMENT 'Puerto de destino',
  `muelle` varchar(50) NOT NULL COMMENT 'Número o nombre del muelle',
  `atraque` varchar(50) NOT NULL COMMENT 'Posición de atraque',
  `estatus` varchar(50) NOT NULL COMMENT 'Estado actual del buque',
  `hora` time NOT NULL COMMENT 'Hora programada de salida',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro en el sistema',
  `fecha_salida` date NULL COMMENT 'Fecha programada de salida',
  PRIMARY KEY (`id`),
  KEY `idx_naviera` (`naviera`),
  KEY `idx_buque` (`buque`),
  KEY `idx_fecha_salida` (`fecha_salida`),
  KEY `idx_hora` (`hora`)
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabla de salidas/partidas de buques del puerto';

-- ================================================
-- DATOS DE EJEMPLO PARA ARRIBOS
-- ================================================
INSERT INTO `arribos` (`naviera`, `buque`, `destino`, `muelle`, `atraque`, `estatus`, `hora`, `fecha_arribo`) VALUES
('MAERSK LINE', 'MAERSK CAIRO', 'Puerto de Manzanillo', 'Muelle 1', 'Posición A', 'En tránsito', '08:30:00', CURDATE()),
('EVERGREEN', 'EVER GIVEN', 'Puerto de Veracruz', 'Muelle 2', 'Posición B', 'Atracado', '10:15:00', CURDATE()),
('MSC', 'MSC GULSUN', 'Puerto de Altamira', 'Muelle 3', 'Posición C', 'Esperando', '14:45:00', CURDATE()),
('COSCO SHIPPING', 'COSCO PACIFIC', 'Puerto de Ensenada', 'Muelle 1', 'Posición D', 'En tránsito', '16:20:00', CURDATE()),
('HAPAG-LLOYD', 'HAPAG EXPRESS', 'Puerto de Mazatlán', 'Muelle 4', 'Posición A', 'Programado', '18:00:00', CURDATE());

-- ================================================
-- DATOS DE EJEMPLO PARA SALIDAS
-- ================================================
INSERT INTO `salidas` (`naviera`, `buque`, `destino`, `muelle`, `atraque`, `estatus`, `hora`, `fecha_salida`) VALUES
('CMA CGM', 'CMA CGM MARCO POLO', 'Long Beach, USA', 'Muelle 2', 'Posición B', 'Listo para zarpar', '09:00:00', CURDATE()),
('YANG MING', 'YM WISDOM', 'Los Angeles, USA', 'Muelle 1', 'Posición A', 'Cargando', '11:30:00', CURDATE()),
('ONE', 'ONE STORK', 'Shanghai, China', 'Muelle 3', 'Posición C', 'En preparación', '13:15:00', CURDATE()),
('PIL', 'PIL NEVADA', 'Valparaíso, Chile', 'Muelle 4', 'Posición D', 'Esperando', '15:45:00', CURDATE()),
('ZIMA', 'ZIMA SANTOS', 'Santos, Brasil', 'Muelle 1', 'Posición A', 'Programado', '17:30:00', CURDATE());

CREATE USER IF NOT EXISTS 'jorge'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON buquesbd.* TO 'jorge'@'localhost';
FLUSH PRIVILEGES;


-- Vista para arribos de hoy
CREATE OR REPLACE VIEW `vista_arribos_hoy` AS
SELECT 
    naviera,
    buque,
    destino,
    muelle,
    atraque,
    estatus,
    hora,
    fecha_arribo
FROM arribos 
WHERE fecha_arribo = CURDATE()
ORDER BY hora;

-- Vista para salidas de hoy
CREATE OR REPLACE VIEW `vista_salidas_hoy` AS
SELECT 
    naviera,
    buque,
    destino,
    muelle,
    atraque,
    estatus,
    hora,
    fecha_salida
FROM salidas 
WHERE fecha_salida = CURDATE()
ORDER BY hora;

-- ================================================
-- CONSULTAS DE VERIFICACIÓN
-- ================================================
-- Verificar que las tablas se crearon correctamente
SELECT 'Tabla arribos creada' as mensaje, COUNT(*) as registros FROM arribos;
SELECT 'Tabla salidas creada' as mensaje, COUNT(*) as registros FROM salidas;

-- ================================================
-- FIN DEL SCRIPT
-- ================================================
