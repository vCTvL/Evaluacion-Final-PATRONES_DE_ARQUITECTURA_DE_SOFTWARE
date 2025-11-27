const express = require("express");
const router = express.Router();
const librosController = require("../controllers/librosController");

// Definimos rutas relativas porque en server.js se monta con app.use('/libros', ...)
router.get("/libros", librosController.obtenerLibros);
router.post("/libros", librosController.crearLibro);
router.put("/libros/:id", librosController.modificarLibro);
router.delete("/libros/:id", librosController.eliminarLibro);

module.exports = router;