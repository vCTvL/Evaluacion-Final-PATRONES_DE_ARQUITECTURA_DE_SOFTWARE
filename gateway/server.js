const express = require("express");
const path = require("path");

const app = express();

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Importar rutas
const usuarioRoutes = require("./routes/usuarioRoutes");
const librosRoutes = require("./routes/librosRoutes");


app.use("/", usuarioRoutes, librosRoutes);
//app.use("/libs", librosRoutes);

app.listen(5003, () => console.log("Cliente web en http://localhost:5003"));
