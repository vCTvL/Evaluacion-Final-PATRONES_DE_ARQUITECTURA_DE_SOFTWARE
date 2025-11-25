const router = require("express").Router();
const controller = require("../controllers/usuarioController");

router.get("/usuarios", controller.listarUsuarios);
router.post("/crearUsuario", controller.crearUsuario);
router.post("/login", controller.obtenerUsuario);

module.exports = router;
