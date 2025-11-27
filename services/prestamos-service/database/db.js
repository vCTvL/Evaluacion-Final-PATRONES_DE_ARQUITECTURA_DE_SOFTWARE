const sql = require('mssql');

// Configuración de conexión a SQL Server
const config = {
    user: 'node_user',          // Cambiar por tu usuario de SQL Server
    password: '123456',    // Cambiar por tu contraseña
    server: 'localhost',          // O tu servidor (ej: 'localhost\\SQLEXPRESS')
    database: 'libros_db',        // Nombre de tu base de datos
    options: {
        encrypt: false,           // true si usas Azure
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Crear pool de conexiones
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Conectado a SQL Server (Préstamos Service)');
        return pool;
    })
    .catch(err => {
        console.error('❌ Error al conectar a SQL Server:', err);
        process.exit(1);
    });

module.exports = config;