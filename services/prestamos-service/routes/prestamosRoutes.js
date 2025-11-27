const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamosController');

// Crear préstamo (prestar libro)
router.post('/', prestamosController.prestarLibro);

// Obtener todos los préstamos
router.get('/', prestamosController.obtenerTodos);

// Obtener solo préstamos activos
router.get('/activos', prestamosController.obtenerActivos);

// Devolver libro (actualizar préstamo)
router.put('/:id/devolver', prestamosController.devolverLibro);

module.exports = router;