import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function revisarBaseDatos() {
    let connection;
    
    try {
        // Configuración de conexión
        const config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'buquesbd',
            port: process.env.DB_PORT || 3306
        };
        
        console.log('🔍 Conectando a la base de datos...');
        console.log(`Host: ${config.host}:${config.port}`);
        console.log(`Base de datos: ${config.database}`);
        console.log(`Usuario: ${config.user}`);
        
        // Crear conexión
        connection = await mysql.createConnection(config);
        
        console.log('✅ Conexión exitosa a la base de datos');
        
        // Revisar tablas existentes
        console.log('\n📊 Tablas en la base de datos:');
        const [tables] = await connection.execute('SHOW TABLES');
        tables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
        });
        
        // Verificar estructura de la tabla buques
        console.log('\n🚢 Estructura de la tabla buques:');
        const [columns] = await connection.execute('DESCRIBE buques');
        columns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
        });
        
        // Contar registros
        console.log('\n📈 Cantidad de registros:');
        const [count] = await connection.execute('SELECT COUNT(*) as total FROM buques');
        console.log(`  Total de buques: ${count[0].total}`);
        
        // Mostrar algunos registros recientes
        console.log('\n🕐 Registros recientes (últimos 5):');
        const [recent] = await connection.execute(`
            SELECT id, nombre, tipo, fecha_arribo, fecha_salida, estado
            FROM buques 
            ORDER BY fecha_arribo DESC 
            LIMIT 5
        `);
        
        recent.forEach(buque => {
            console.log(`  - ${buque.id}: ${buque.nombre} (${buque.tipo}) - ${buque.estado}`);
            console.log(`    Arribo: ${buque.fecha_arribo || 'N/A'}`);
            console.log(`    Salida: ${buque.fecha_salida || 'N/A'}`);
        });
        
        // Estadísticas por estado
        console.log('\n📊 Estadísticas por estado:');
        const [stats] = await connection.execute(`
            SELECT estado, COUNT(*) as cantidad
            FROM buques 
            GROUP BY estado
            ORDER BY cantidad DESC
        `);
        
        stats.forEach(stat => {
            console.log(`  - ${stat.estado}: ${stat.cantidad} buques`);
        });
        
        // Verificar datos de hoy
        console.log('\n📅 Movimientos de hoy:');
        const [today] = await connection.execute(`
            SELECT COUNT(*) as arribos_hoy
            FROM buques 
            WHERE DATE(fecha_arribo) = CURDATE()
        `);
        
        const [todayOut] = await connection.execute(`
            SELECT COUNT(*) as salidas_hoy
            FROM buques 
            WHERE DATE(fecha_salida) = CURDATE()
        `);
        
        console.log(`  - Arribos hoy: ${today[0].arribos_hoy}`);
        console.log(`  - Salidas hoy: ${todayOut[0].salidas_hoy}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Soluciones posibles:');
            console.log('  - Verificar que MySQL esté ejecutándose');
            console.log('  - Revisar las credenciales en el archivo .env');
            console.log('  - Verificar que el puerto 3306 esté disponible');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔒 Conexión cerrada');
        }
    }
}

// Ejecutar la función
revisarBaseDatos().catch(console.error);
