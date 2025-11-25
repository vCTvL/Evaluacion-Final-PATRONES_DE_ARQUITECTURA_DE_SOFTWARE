const router = require("express").Router();
const controller = require("../controllers/librosController");

router.get("/libros", controller.obtenerLibros);
router.post("/crearLibro", controller.crearLibro);
router.put("/modificarLibro/:id", controller.modificarLibro);
router.delete("/eliminarLibro/:id", controller.eliminarLibro);

module.exports = router;