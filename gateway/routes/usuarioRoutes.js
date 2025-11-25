const express = require("express");
const path = require("path");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// Ruta para mostrar la página principal
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.get("/login", usuariosController.renderLogin);
router.post("/login", usuariosController.iniciarSesion);

// Ruta para mostrar usuarios con EJS
router.get("/usuarios", usuariosController.mostrarUsuarios);

// Manejar creación de usuarios desde el formulario o fetch del cliente
router.post("/usuarios", usuariosController.crearUsuario);

module.exports = router;
