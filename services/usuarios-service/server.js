const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const usuarioRoutes = require("./routes/usuarioRoutes");
app.use("/", usuarioRoutes);


app.listen(3001, () => console.log("SOA Usuarios en http://localhost:3001"));
