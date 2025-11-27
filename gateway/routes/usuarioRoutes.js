const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// Rutas públicas: login, crear usuario, logout
router.get("/login", usuariosController.renderLogin);
router.post("/login", usuariosController.iniciarSesion);
router.get("/logout", usuariosController.cerrarSesion);

// Registro y listado (página de registro/usuarios)
router.get("/usuarios", usuariosController.mostrarUsuarios);
router.post("/usuarios", usuariosController.crearUsuario);

module.exports = router;
