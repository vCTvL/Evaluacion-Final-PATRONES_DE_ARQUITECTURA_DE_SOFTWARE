const repo = require("../repository/usuariosRepo");
const jwt = require("jsonwebtoken");
const amqpClient = require('../../../service-bus/amqpClient.js')

const SECRET_KEY = "tu_clave_secreta_super_segura_2024";

exports.listarUsuarios = async (req, res) => {
    const usuarios = await repo.obtenerUsuarios();
    res.json(usuarios);
};

exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
        }

        const nuevoUsuario = await repo.crearUsuario(nombre, email, password);
        
        // ============ BROKER: PUBLICAR EVENTO ============
        try {
            await amqpClient.publish('usuario.created', {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol,
                timestamp: new Date().toISOString()
            });
            console.log(`📤 EVENTO PUBLICADO: usuario.created (${nombre})`);
        } catch (err) {
            console.warn(`⚠️  Error publicando evento: ${err.message}`);
        }
        // ================================================
        
        res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error al crear usuario" });
    }
};

exports.obtenerUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        // Buscar usuario y verificar contraseña (repo compara bcrypt)
        const usuario = await repo.getOneUser(email, password);

        if (!usuario) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Generar JWT con información del usuario
        const token = jwt.sign(
            {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            SECRET_KEY,
            { expiresIn: '8h' }
        );

        res.json({ message: "Usuario autenticado", token, usuario });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ message: "Error al obtener usuario" });
    }
};

