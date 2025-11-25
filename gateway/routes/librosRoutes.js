const express = require("express");
const path = require("path");
const router = express.Router();
const librosController = require("../controllers/librosController");

router.get("/libros", librosController.obtenerLibros);
router.post("/libros", librosController.crearLibro);

module.exports = router;