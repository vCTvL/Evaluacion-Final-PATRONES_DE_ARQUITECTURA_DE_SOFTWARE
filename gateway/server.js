const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS: permitir que el frontend servido por el microservicio de préstamos (http://localhost:3003)

app.use(cors({ origin: 'http://localhost:3003', credentials: true }));
app.use(cookieParser());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Importar middleware y rutas
const middleware = require("./middleware/middleware");
const jwt = require("jsonwebtoken");
const usuarioRoutes = require("./routes/usuarioRoutes");
const librosRoutes = require("./routes/librosRoutes");


app.use(middleware.parseCookies || ((req,res,next)=>next()));


app.use((req, res, next) => {
	try {
		const token = req.cookies && req.cookies.authToken;
		if (token) {
			const decoded = jwt.verify(token, middleware.SECRET_KEY || '');
			req.user = decoded;
		}
	} catch (err) {
		
		res.clearCookie && res.clearCookie('authToken');
	}
	next();
});


app.use("/", usuarioRoutes, librosRoutes);



app.get('/me', (req, res) => {
	if (req.user) return res.json(req.user);
	return res.status(401).json({ message: 'No autenticado' });
});


app.get("/", middleware.verificarAutenticacion, middleware.verificarAdmin, (req, res) => {
	res.sendFile(path.join(__dirname, "views", "index.html"));
});


app.get("/prestamos", middleware.verificarAutenticacion, (req, res) => {
	// Redirige al servicio de préstamos que sirve su propio HTML en :3003
	return res.redirect('http://localhost:3003/');
});



app.listen(5003, () => console.log("Cliente web en http://localhost:5003"));
