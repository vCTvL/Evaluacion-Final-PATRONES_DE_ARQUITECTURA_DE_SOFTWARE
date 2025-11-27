const sql = require("mssql");

const config = {
    user: "node_user",
    password: "123456",
    database: "libros_db",
    server: "localhost",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

let pool = null;

async function getConnection() {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            // Mensaje solicitado: indicar conexión exitosa en mayúsculas
            console.log("CONEXION EXITOSA DE SQL SERVER - LIBROS_SERVICE");
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


