const path = require("path");

exports.renderLogin = (req, res) => {
    // Si ya existe sesión (req.user), redirigir según rol
    if (req.user) {
        return req.user.rol === 'admin' ? res.redirect('/') : res.redirect('/prestamos');
    }
    res.sendFile(path.join(__dirname, "../views/login.html"));
};

exports.mostrarUsuarios = async (req, res) => {
    try {
        const usuarios = await fetch("http://localhost:3001/usuarios")
            .then(r => r.json());

        res.render("usuarios", { usuarios });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error al cargar usuarios");
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const response = await fetch("http://localhost:3001/crearUsuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, password })
        });

        if (!response.ok) throw new Error("Servicio 3001 falló");

        // Tras crear usuario, redirigir a login
        res.redirect("/login");
    } catch (err) {
        console.error("Error al crear usuario:", err);
        res.status(500).send("Error al crear usuario");
    }
};

exports.iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        const response = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const status = response.status === 401 ? 401 : 500;
            return res.status(status).json({ message: data.message || "Credenciales inválidas" });
        }

        // Guardar token JWT en cookie httpOnly
        res.cookie('authToken', data.token, {
            httpOnly: true,
            secure: false,
            maxAge: 8 * 60 * 60 * 1000 // 8 horas
        });

        // Redirigir según rol: admin -> / , normal -> /prestamos
        const redirect = data.usuario && data.usuario.rol === 'admin' ? '/' : '/prestamos';
        return res.status(200).json({ message: 'Inicio de sesión exitoso', redirect });
    } catch (err) {
        console.error("Error al iniciar sesión:", err);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

exports.cerrarSesion = (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login');
};