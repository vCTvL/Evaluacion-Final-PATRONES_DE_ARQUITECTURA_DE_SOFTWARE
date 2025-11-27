const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS: permitir que el frontend servido por el microservicio de préstamos (http://localhost:3003)
// haga solicitudes y envíe cookies (credentials)
app.use(cors({ origin: 'http://localhost:3003', credentials: true }));
app.use(cookieParser());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Importar middleware y rutas
const middleware = require("./middleware/middleware");
const jwt = require("jsonwebtoken");
const usuarioRoutes = require("./routes/usuarioRoutes");
const librosRoutes = require("./routes/librosRoutes");

// Usar parser de cookies (exportado desde middleware en caso de necesitarlo)
app.use(middleware.parseCookies || ((req,res,next)=>next()));

// Adjuntar `req.user` si existe cookie con token (no redirige)
app.use((req, res, next) => {
	try {
		const token = req.cookies && req.cookies.authToken;
		if (token) {
			const decoded = jwt.verify(token, middleware.SECRET_KEY || '');
			req.user = decoded;
		}
	} catch (err) {
		// token inválido: limpiar cookie para evitar bucles
		res.clearCookie && res.clearCookie('authToken');
	}
	next();
});

// Rutas públicas (login, crear usuario, logout)
// Rutas públicas (login, crear usuario, logout y rutas públicas de libros)
app.use("/", usuarioRoutes, librosRoutes);


// Endpoint que devuelve el usuario actual leyendo la cookie httpOnly en el servidor
app.get('/me', (req, res) => {
	if (req.user) return res.json(req.user);
	return res.status(401).json({ message: 'No autenticado' });
});

// Ruta protegida: index solo para admin
app.get("/", middleware.verificarAutenticacion, middleware.verificarAdmin, (req, res) => {
	res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Ruta protegida para usuarios normales (redirige al servicio de prestamos)
app.get("/prestamos", middleware.verificarAutenticacion, (req, res) => {
	// Redirige al servicio de préstamos que sirve su propio HTML en :3003
	return res.redirect('http://localhost:3003/');
});



app.listen(5003, () => console.log("Cliente web en http://localhost:5003"));
