const db = require("../database/db");
const sql = require("mssql");

// Datos de respaldo cuando la base de datos no está disponible
const usuariosBackup = [
    { id: 1, nombre: "Lucía" },
    { id: 2, nombre: "Juan" },
    { id: 3, nombre: "Maria" },
    { id: 4, nombre: "Pedro" },
    { id: 5, nombre: "Ana" },
    { id: 6, nombre: "Luis" },
    { id: 7, nombre: "Carlos" },
    { id: 8, nombre: "Sofia" },
    { id: 9, nombre: "Diego" },
    { id: 10, nombre: "Laura" }
];

module.exports = {
    async obtenerUsuarios() {
        try {
            const usuarios = await db.query("SELECT * FROM usuarios");
            return usuarios;
        } catch (error) {
            console.error("Error al obtener usuarios:", error.message);
            console.log("Usando datos de respaldo (base de datos no disponible)");
            return usuariosBackup;
        }
    },

    async crearUsuario(nombre, email, password) {
        try {
            const pool = await db.getConnection();

            const result = await pool.request()
                .input("nombre", sql.VarChar, nombre)
                .input("email", sql.VarChar, email)
                .input("password", sql.VarChar, password)
                .query(`
                    INSERT INTO usuarios (nombre, email, password)
                    VALUES (@nombre, @email, @password);

                    SELECT SCOPE_IDENTITY() AS id;
                `);

            return result.recordset[0];
        } catch (error) {
            console.error("Error al crear usuario:", error.message);

            // Fallback local cuando la base de datos no está disponible
            const nuevoUsuario = {
                id: usuariosBackup.length + 1,
                nombre,
                email,
                password
            };

            usuariosBackup.push(nuevoUsuario);
            console.log("Usuario almacenado temporalmente en memoria");
            return nuevoUsuario;
        }
    },

    async getOneUser(email, password) {
        try {
            const pool = await db.getConnection();
            const result = await pool.request()
                .input("email", sql.VarChar, email)
                .input("password", sql.VarChar, password)
                .query(`
                    SELECT TOP 1 id, nombre, email
                    FROM usuarios
                    WHERE email = @email AND password = @password
                `);

            return result.recordset[0] || null;
        } catch (error) {
            console.error("Error al obtener usuario:", error.message);

            // Fallback local en caso de que la base de datos no esté disponible
            return usuariosBackup.find(
                (u) => u.email === email && u.password === password
            ) || null;
        }
    }
};