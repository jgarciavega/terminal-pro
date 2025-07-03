import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 REVISIÓN COMPLETA DE LA BASE DE DATOS');
console.log('==========================================');

async function revisarBD() {
    let connection;
    
    try {
        // Configuración de conexión
        const config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'jorge',
            password: process.env.DB_PASSWORD || 'password123',
            database: process.env.DB_NAME || 'buquesbd',
            port: process.env.DB_PORT || 3306
        };
        
        console.log(`\n🔗 Conectando a: ${config.host}:${config.port}`);
        console.log(`📊 Base de datos: ${config.database}`);
        console.log(`👤 Usuario: ${config.user}`);
        
        // Conectar
        connection = await mysql.createConnection(config);
        console.log('✅ Conexión exitosa');
        
        // 1. Verificar tablas existentes
        console.log('\n📋 TABLAS EXISTENTES:');
        const [tables] = await connection.execute('SHOW TABLES');
        tables.forEach(table => {
            console.log(`  ✓ ${Object.values(table)[0]}`);
        });
        
        // 2. Verificar estructura de arribos
        console.log('\n🚢 ESTRUCTURA DE ARRIBOS:');
        try {
            const [arribosStructure] = await connection.execute('DESCRIBE arribos');
            arribosStructure.forEach(col => {
                console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
            });
        } catch (error) {
            console.log('  ❌ Tabla arribos no existe');
        }
        
        // 3. Verificar estructura de salidas
        console.log('\n⛵ ESTRUCTURA DE SALIDAS:');
        try {
            const [salidasStructure] = await connection.execute('DESCRIBE salidas');
            salidasStructure.forEach(col => {
                console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
            });
        } catch (error) {
            console.log('  ❌ Tabla salidas no existe');
        }
        
        // 4. Contar registros
        console.log('\n📊 CANTIDAD DE REGISTROS:');
        try {
            const [arribosCount] = await connection.execute('SELECT COUNT(*) as count FROM arribos');
            console.log(`  📥 Arribos: ${arribosCount[0].count}`);
        } catch (error) {
            console.log('  ❌ Error contando arribos');
        }
        
        try {
            const [salidasCount] = await connection.execute('SELECT COUNT(*) as count FROM salidas');
            console.log(`  📤 Salidas: ${salidasCount[0].count}`);
        } catch (error) {
            console.log('  ❌ Error contando salidas');
        }
        
        // 5. Mostrar datos de arribos
        console.log('\n📥 DATOS DE ARRIBOS:');
        try {
            const [arribos] = await connection.execute('SELECT * FROM arribos LIMIT 5');
            if (arribos.length > 0) {
                arribos.forEach(arribo => {
                    console.log(`  • ${arribo.naviera} - ${arribo.buque} (${arribo.destino})`);
                    console.log(`    Estado: ${arribo.estatus} | Hora: ${arribo.hora} | Fecha: ${arribo.fecha_arribo}`);
                });
            } else {
                console.log('  ⚠️  No hay datos de arribos');
            }
        } catch (error) {
            console.log('  ❌ Error obteniendo arribos:', error.message);
        }
        
        // 6. Mostrar datos de salidas
        console.log('\n📤 DATOS DE SALIDAS:');
        try {
            const [salidas] = await connection.execute('SELECT * FROM salidas LIMIT 5');
            if (salidas.length > 0) {
                salidas.forEach(salida => {
                    console.log(`  • ${salida.naviera} - ${salida.buque} (${salida.destino})`);
                    console.log(`    Estado: ${salida.estatus} | Hora: ${salida.hora} | Fecha: ${salida.fecha_salida}`);
                });
            } else {
                console.log('  ⚠️  No hay datos de salidas');
            }
        } catch (error) {
            console.log('  ❌ Error obteniendo salidas:', error.message);
        }
        
        // 7. Probar consultas del API
        console.log('\n🔍 PRUEBAS DE CONSULTAS API:');
        try {
            const [testArribos] = await connection.execute(`
                SELECT COUNT(*) as count FROM arribos 
                WHERE fecha_arribo = CURDATE() OR fecha_arribo IS NULL
            `);
            console.log(`  📥 Arribos hoy/programados: ${testArribos[0].count}`);
        } catch (error) {
            console.log('  ❌ Error en consulta arribos:', error.message);
        }
        
        try {
            const [testSalidas] = await connection.execute(`
                SELECT COUNT(*) as count FROM salidas 
                WHERE fecha_salida = CURDATE() OR fecha_salida IS NULL
            `);
            console.log(`  📤 Salidas hoy/programadas: ${testSalidas[0].count}`);
        } catch (error) {
            console.log('  ❌ Error en consulta salidas:', error.message);
        }
        
        console.log('\n✅ Revisión completada');
        
    } catch (error) {
        console.error('\n❌ ERROR DE CONEXIÓN:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 POSIBLES SOLUCIONES:');
            console.log('  1. Verificar que MySQL esté ejecutándose');
            console.log('  2. Revisar las credenciales en .env');
            console.log('  3. Verificar el puerto 3306');
            console.log('  4. Ejecutar: npm install mysql2 dotenv');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n🔐 PROBLEMA DE AUTENTICACIÓN:');
            console.log('  - Verificar usuario y contraseña');
            console.log('  - Verificar permisos del usuario');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('\n🗃️ BASE DE DATOS NO EXISTE:');
            console.log('  - Ejecutar el script buquesbd_script.sql primero');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔒 Conexión cerrada');
        }
    }
}

revisarBD().catch(console.error);
