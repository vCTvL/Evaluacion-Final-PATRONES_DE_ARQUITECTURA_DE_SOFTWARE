const sql = require("mssql");

const config = {
    user: "useradmin",
    password: "admin123.",
    database: "usuarios_db",
    server: "feriaserver.database.windows.net",
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};
let pool = null;

async function getConnection() {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log("Conectado a SQL Server");
        } catch (error) {
            console.error("Error al conectar a la base de datos:", error.message);
            // Limpiar el pool si falla para permitir reintentos
            pool = null;
            throw error;
        }
    }
    return pool;
}

module.exports = {
    getConnection,
    async query(queryText) {
        try {
            const activePool = await getConnection();
            const result = await activePool.request().query(queryText);
            return result.recordset;
        } catch (error) {
            console.error("Error en la consulta:", error.message);
            throw error;
        }
    },
    async close() {
        if (pool) {
            await pool.close();
            pool = null;
        }
    }
};


