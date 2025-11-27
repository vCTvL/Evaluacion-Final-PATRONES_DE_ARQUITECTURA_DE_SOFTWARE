const sql = require('mssql');
const dbConfig = require('../database/db');

// Crear un nuevo préstamo
exports.crearPrestamo = async (libro_id, usuario_nombre) => {
    try {
        const pool = await sql.connect(dbConfig);
        const fechaPrestamo = new Date().toISOString().split('T')[0];
        
        const result = await pool.request()
            .input('libro_id', sql.Int, libro_id)
            .input('usuario_nombre', sql.VarChar(100), usuario_nombre)
            .input('fecha_prestamo', sql.Date, fechaPrestamo)
            .query(`
                INSERT INTO prestamos (libro_id, usuario_nombre, fecha_prestamo, estado)
                VALUES (@libro_id, @usuario_nombre, @fecha_prestamo, 'activo');
                SELECT SCOPE_IDENTITY() AS id;
            `);
        
        await pool.close();
        
        return {
            id: result.recordset[0].id,
            libro_id,
            usuario_nombre,
            fecha_prestamo: fechaPrestamo,
            estado: 'activo'
        };
    } catch (error) {
        console.error('Error en crearPrestamo:', error);
        throw error;
    }
};

// Verificar si un libro ya está prestado (y no devuelto)
exports.verificarLibroPrestado = async (libro_id) => {
    try {
        const pool = await sql.connect(dbConfig);
        
        const result = await pool.request()
            .input('libro_id', sql.Int, libro_id)
            .query(`
                SELECT TOP 1 * FROM prestamos 
                WHERE libro_id = @libro_id AND estado = 'activo'
            `);
        
        await pool.close();
        return result.recordset.length > 0;
    } catch (error) {
        console.error('Error en verificarLibroPrestado:', error);
        throw error;
    }
};

// Obtener todos los préstamos
exports.obtenerTodos = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        
        const result = await pool.request()
            .query(`
                SELECT * FROM prestamos 
                ORDER BY fecha_prestamo DESC
            `);
        
        await pool.close();
        return result.recordset;
    } catch (error) {
        console.error('Error en obtenerTodos:', error);
        throw error;
    }
};

// Obtener solo préstamos activos
exports.obtenerActivos = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        
        const result = await pool.request()
            .query(`
                SELECT * FROM prestamos 
                WHERE estado = 'activo'
                ORDER BY fecha_prestamo DESC
            `);
        
        await pool.close();
        return result.recordset;
    } catch (error) {
        console.error('Error en obtenerActivos:', error);
        throw error;
    }
};

// Obtener un préstamo por ID
exports.obtenerPorId = async (id) => {
    try {
        const pool = await sql.connect(dbConfig);
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT * FROM prestamos WHERE id = @id`);
        
        await pool.close();
        return result.recordset[0];
    } catch (error) {
        console.error('Error en obtenerPorId:', error);
        throw error;
    }
};

// Devolver un libro (marcar como devuelto)
exports.devolverLibro = async (id) => {
    try {
        const pool = await sql.connect(dbConfig);
        const fechaDevolucion = new Date().toISOString().split('T')[0];
        
        await pool.request()
            .input('id', sql.Int, id)
            .input('fecha_devolucion', sql.Date, fechaDevolucion)
            .query(`
                UPDATE prestamos 
                SET fecha_devolucion = @fecha_devolucion, estado = 'devuelto'
                WHERE id = @id
            `);
        
        await pool.close();
        return true;
    } catch (error) {
        console.error('Error en devolverLibro:', error);
        throw error;
    }
};