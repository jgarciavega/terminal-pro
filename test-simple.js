import mysql from 'mysql2/promise';

console.log('Iniciando prueba de conexión...');

const config = {
    host: 'localhost',
    user: 'jorge',
    password: 'password123',
    database: 'buquesbd',
    port: 3306
};

try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Conexión exitosa');
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tablas:', tables);
    
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM buques');
    console.log('Total buques:', count[0].total);
    
    await connection.end();
    console.log('Conexión cerrada');
} catch (error) {
    console.error('❌ Error:', error.message);
}
