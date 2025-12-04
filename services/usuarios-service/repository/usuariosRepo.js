const db = require("../database/db");
const sql = require("mssql");
const bcrypt = require("bcrypt");

module.exports = {
    async obtenerUsuarios() {
        try {
            const usuarios = await db.query("SELECT id, nombre, email, rol FROM usuarios");
            return usuarios;
        } catch (error) {
            console.error("Error al obtener usuarios:", error.message);
            return [];
        }
    },

    async crearUsuario(nombre, email, password) {
        try {
            // Hashear contraseña con bcrypt (salt automático)
            const hashedPassword = await bcrypt.hash(password, 10);
            const pool = await db.getConnection();

            // Asignar rol en función del nombre: si nombre === 'admin' => 'admin', else 'normal'
            const rol = (typeof nombre === 'string' && nombre.trim().toLowerCase() === 'admin') ? 'admin' : 'normal';

            const result = await pool.request()
                .input("nombre", sql.VarChar, nombre)
                .input("email", sql.VarChar, email)
                .input("password", sql.VarChar, hashedPassword)
                .input("rol", sql.VarChar, rol)
                .query(`
                    INSERT INTO usuarios (nombre, email, password, rol)
                    VALUES (@nombre, @email, @password, @rol);

                    SELECT SCOPE_IDENTITY() AS id, @nombre AS nombre, @email AS email, @rol AS rol;
                `);

            // Retornar objeto con id, nombre, email y rol para que el evento incluya todos los datos
            return {
                id: result.recordset[0].id,
                nombre: nombre,
                email: email,
                rol: rol
            };
        } catch (error) {
            console.error("Error al crear usuario:", error.message);
            throw error;
        }
    },

    async getOneUser(email, password) {
        try {
            const pool = await db.getConnection();
            const result = await pool.request()
                .input("email", sql.VarChar, email)
                .query(`
                    SELECT id, nombre, email, password, rol
                    FROM usuarios
                    WHERE email = @email
                `);

            const usuario = result.recordset[0];
            if (!usuario) return null;

            // Comparar contraseña con bcrypt
            const match = await bcrypt.compare(password, usuario.password);
            if (!match) return null;

            return {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            };
        } catch (error) {
            console.error("Error al obtener usuario:", error.message);
            return null;
        }
    }
};