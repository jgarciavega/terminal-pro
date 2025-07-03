// =============================
// 🔍 REVISAR BASE DE DATOS
// =============================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'jorge',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'buquesbd',
  port: process.env.DB_PORT || 3306
};

async function checkDatabase() {
  let connection;
  
  try {
    console.log('🔗 Conectando a la base de datos...');
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log(`👤 User: ${dbConfig.user}`);
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión exitosa!\n');

    // 1. Revisar qué tablas existen
    console.log('📋 TABLAS EN LA BASE DE DATOS:');
    console.log('================================');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('❌ No hay tablas en la base de datos');
      return;
    }

    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`${index + 1}. ${tableName}`);
    });
    console.log('');

    // 2. Revisar estructura y datos de cada tabla
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      
      console.log(`🔍 TABLA: ${tableName.toUpperCase()}`);
      console.log('========================');
      
      // Estructura de la tabla
      const [structure] = await connection.query(`DESCRIBE ${tableName}`);
      console.log('📋 Estructura:');
      structure.forEach(column => {
        console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? '(NOT NULL)' : ''} ${column.Key ? `(${column.Key})` : ''}`);
      });
      
      // Contar registros
      const [count] = await connection.query(`SELECT COUNT(*) as total FROM ${tableName}`);
      const totalRecords = count[0].total;
      console.log(`📊 Total de registros: ${totalRecords}`);
      
      // Mostrar algunos datos de ejemplo
      if (totalRecords > 0) {
        console.log('📝 Datos de ejemplo:');
        const [sampleData] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
        
        if (sampleData.length > 0) {
          // Mostrar headers
          const headers = Object.keys(sampleData[0]);
          console.log(`   ${headers.join(' | ')}`);
          console.log(`   ${headers.map(h => '-'.repeat(h.length)).join('-+-')}`);
          
          // Mostrar datos
          sampleData.forEach(row => {
            const values = headers.map(header => {
              let value = row[header];
              if (value === null) value = 'NULL';
              if (typeof value === 'string' && value.length > 20) {
                value = value.substring(0, 17) + '...';
              }
              return String(value).padEnd(headers.find(h => h === header).length);
            });
            console.log(`   ${values.join(' | ')}`);
          });
        }
      } else {
        console.log('⚠️ Tabla vacía');
      }
      
      console.log('');
    }

    // 3. Verificar datos específicos para la API
    console.log('🌊 VERIFICACIÓN PARA APIS:');
    console.log('============================');
    
    // Verificar arribos de hoy
    try {
      const [arribosHoy] = await connection.query(`
        SELECT COUNT(*) as count FROM arribos 
        WHERE DATE(fecha) = CURDATE() OR fecha IS NULL
      `);
      console.log(`🚢 Arribos hoy: ${arribosHoy[0].count}`);
    } catch (err) {
      console.log(`❌ Error en arribos: ${err.message}`);
    }

    // Verificar salidas de hoy
    try {
      const [salidasHoy] = await connection.query(`
        SELECT COUNT(*) as count FROM salidas 
        WHERE DATE(fecha) = CURDATE() OR fecha IS NULL
      `);
      console.log(`⛵ Salidas hoy: ${salidasHoy[0].count}`);
    } catch (err) {
      console.log(`❌ Error en salidas: ${err.message}`);
    }

    // Verificar navieras
    try {
      const [navieras] = await connection.query(`
        SELECT DISTINCT naviera FROM arribos 
        UNION 
        SELECT DISTINCT naviera FROM salidas
      `);
      console.log(`🏢 Navieras encontradas: ${navieras.length}`);
      navieras.forEach(nav => console.log(`   - ${nav.naviera}`));
    } catch (err) {
      console.log(`❌ Error en navieras: ${err.message}`);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('🔧 Verifica:');
    console.error('   - MySQL está ejecutándose');
    console.error('   - Credenciales en .env son correctas');
    console.error('   - La base de datos existe');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

checkDatabase();
