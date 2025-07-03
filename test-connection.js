// =============================
// 🔍 TEST CONEXIÓN SIMPLE
// =============================

import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    console.log('🔗 Probando conexión a MySQL...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'jorge',
      password: 'password123',
      port: 3306
    });
    
    console.log('✅ Conectado a MySQL!');
    
    // Listar bases de datos
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('\n📊 Bases de datos disponibles:');
    databases.forEach(db => {
      console.log(`  - ${Object.values(db)[0]}`);
    });
    
    // Intentar conectar a buquesbd específicamente
    try {
      await connection.query('USE buquesbd');
      console.log('\n✅ Conectado a buquesbd');
      
      const [tables] = await connection.query('SHOW TABLES');
      console.log('\n📋 Tablas en buquesbd:');
      if (tables.length === 0) {
        console.log('  ⚠️ No hay tablas');
      } else {
        tables.forEach(table => {
          console.log(`  - ${Object.values(table)[0]}`);
        });
      }
    } catch (err) {
      console.log(`\n❌ Error con buquesbd: ${err.message}`);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('🔧 Posibles soluciones:');
    console.error('   1. Verificar que MySQL esté ejecutándose');
    console.error('   2. Verificar usuario y contraseña');
    console.error('   3. Verificar que el puerto 3306 esté abierto');
  }
}

testConnection();
