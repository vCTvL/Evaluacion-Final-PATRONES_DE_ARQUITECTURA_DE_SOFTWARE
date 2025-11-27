// Evitar dependencia circular: el repositorio NO debe requerir el controlador
const db = require("../database/db");
const sql = require("mssql");


module.exports = {
    async obtenerLibros() {
        try {
            const libros = await db.query("SELECT * FROM libros ORDER BY id DESC");
            return libros;
        } catch (error) {
            console.error("Error al obtener libros:", error.message);
            return [];
        }
    },

    async crearLibro(titulo, autor , categoria, formato, sinopsis) {
        try{
            const pool = await db.getConnection();
            const result= await pool.request()
                .input("titulo", sql.VarChar, titulo)
                .input("autor", sql.VarChar, autor)
                .input("categoria", sql.VarChar, categoria)
                .input("formato", sql.VarChar, formato)
                .input("sinopsis", sql.VarChar, sinopsis)
                .query(`
                    INSERT INTO libros (titulo, autor, categoria, formato, sinopsis)
                    VALUES (@titulo,@autor,@categoria,@formato,@sinopsis)

                    SELECT SCOPE_IDENTITY() AS id;
                    
                    `);
            
            return result.recordset[0];
        }catch(error){
            console.error("ERROR AL INGRESAR LIBRO: ", error.message);
            throw error;
        }

    },


    async modificarLibro(id, titulo, autor, categoria, formato, sinopsis) {
    try {
        const pool = await db.getConnection();
        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("titulo", sql.VarChar, titulo)
            .input("autor", sql.VarChar, autor)
            .input("categoria", sql.VarChar, categoria)
            .input("formato", sql.VarChar, formato)
            .input("sinopsis", sql.VarChar, sinopsis)
            .query(`
                UPDATE libros
                SET titulo = @titulo,
                    autor = @autor,
                    categoria = @categoria,
                    formato = @formato,
                    sinopsis = @sinopsis
                WHERE id = @id;
            `);

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error("Error al modificar libro:", error.message);
        throw error;
    }
},

    async eliminarLibro(id) {
        try {
            const pool = await db.getConnection();
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query("DELETE FROM libros WHERE id = @id");
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error("Error al eliminar libro:", error.message);
            throw error;
        }
    }

};