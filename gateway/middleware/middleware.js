const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// Clave secreta para firmar/verificar JWT (puedes mover a .env)
const SECRET_KEY = "tu_clave_secreta_super_segura_2024";

// Expone el middleware de parseo de cookies para usar en el servidor
exports.parseCookies = cookieParser();

// Verifica que exista un token válido en la cookie `authToken`
exports.verificarAutenticacion = (req, res, next) => {
	const token = req.cookies && req.cookies.authToken;
	if (!token) {
		return res.redirect('/login');
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		// Adjunta info del usuario a la petición
		req.user = decoded;
		next();
	} catch (err) {
		console.error('Token inválido:', err.message);
		res.clearCookie('authToken');
		return res.redirect('/login');
	}
};

// Permite sólo a administradores
exports.verificarAdmin = (req, res, next) => {
	if (req.user && req.user.rol === 'admin') return next();
	return res.status(403).send('Acceso denegado. Sólo administradores.');
};

// Permite usuarios normales o admin
exports.verificarUsuario = (req, res, next) => {
	if (req.user && (req.user.rol === 'normal' || req.user.rol === 'admin')) return next();
	return res.status(403).send('Acceso denegado.');
};

exports.SECRET_KEY = SECRET_KEY;
