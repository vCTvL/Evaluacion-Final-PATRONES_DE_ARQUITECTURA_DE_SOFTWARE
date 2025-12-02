const sql = require('mssql');

// Configuración de conexión a SQL Server
const config = {
    user: "useradmin",
    password: "admin123.",
    database: "libros_db",
    server: "feriaserver.database.windows.net",
    options: {
        encrypt: true,
        trustServerCertificate: false
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