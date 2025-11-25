const repo = require("../repository/usuariosRepo");

exports.listarUsuarios = async (req, res) => {
    const usuarios = await repo.obtenerUsuarios();
    res.json(usuarios);
};

exports.crearUsuario = async (req, res) => {
    try {
    const { nombre, email, password } = req.body;
        const usuario = await repo.crearUsuario(nombre, email, password);
        res.status(201).send({ message: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).send("Error al crear usuario")
    }
};

exports.obtenerUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        const usuario = await repo.getOneUser(email, password);

        if (!usuario) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        res.json({ message: "Usuario autenticado", usuario });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).send("Error al obtener usuario");
    }
};

