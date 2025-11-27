const prestamosRepo = require('../repository/prestamosRepo');

// Prestar un libro
exports.prestarLibro = async (req, res) => {
    try {
        const { libro_id, usuario_nombre } = req.body;

        // Validaciones básicas
        if (!libro_id || !usuario_nombre) {
            return res.status(400).json({ 
                message: 'Faltan datos: libro_id y usuario_nombre son requeridos' 
            });
        }

        // Verificar si el libro ya está prestado
        const libroYaPrestado = await prestamosRepo.verificarLibroPrestado(libro_id);
        
        if (libroYaPrestado) {
            return res.status(400).json({ 
                message: 'Este libro ya está prestado y no ha sido devuelto' 
            });
        }

        // Crear el préstamo
        const prestamo = await prestamosRepo.crearPrestamo(libro_id, usuario_nombre);

        res.status(201).json({
            message: 'Libro prestado exitosamente',
            prestamo
        });

    } catch (error) {
        console.error('Error al prestar libro:', error);
        res.status(500).json({ 
            message: 'Error al prestar el libro',
            error: error.message 
        });
    }
};

// Obtener todos los préstamos
exports.obtenerTodos = async (req, res) => {
    try {
        const prestamos = await prestamosRepo.obtenerTodos();
        res.json(prestamos);
    } catch (error) {
        console.error('Error al obtener préstamos:', error);
        res.status(500).json({ 
            message: 'Error al obtener los préstamos',
            error: error.message 
        });
    }
};

// Obtener solo préstamos activos
exports.obtenerActivos = async (req, res) => {
    try {
        const prestamos = await prestamosRepo.obtenerActivos();
        res.json(prestamos);
    } catch (error) {
        console.error('Error al obtener préstamos activos:', error);
        res.status(500).json({ 
            message: 'Error al obtener los préstamos activos',
            error: error.message 
        });
    }
};

// Devolver un libro
exports.devolverLibro = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el préstamo existe y está activo
        const prestamoExiste = await prestamosRepo.obtenerPorId(id);
        
        if (!prestamoExiste) {
            return res.status(404).json({ 
                message: 'Préstamo no encontrado' 
            });
        }

        if (prestamoExiste.estado === 'devuelto') {
            return res.status(400).json({ 
                message: 'Este libro ya fue devuelto anteriormente' 
            });
        }

        // Marcar como devuelto
        await prestamosRepo.devolverLibro(id);

        res.json({
            message: 'Libro devuelto exitosamente'
        });

    } catch (error) {
        console.error('Error al devolver libro:', error);
        res.status(500).json({ 
            message: 'Error al devolver el libro',
            error: error.message 
        });
    }
};