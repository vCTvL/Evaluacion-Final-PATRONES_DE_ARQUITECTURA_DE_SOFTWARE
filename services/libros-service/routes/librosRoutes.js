const router = require("express").Router();
const controller = require("../controllers/librosController");

router.get("/libros", controller.obtenerLibros);
router.post("/crearLibro", controller.crearLibro);

module.exports = router;