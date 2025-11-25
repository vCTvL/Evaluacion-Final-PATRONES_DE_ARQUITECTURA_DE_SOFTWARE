const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // ¡Importante para permitir llamadas desde el cliente!

app.get("/todo", async (req, res) => {
  const productos = await axios.get("http://localhost:5001/productos");
  const usuarios = await axios.get("http://localhost:5002/usuarios");

  res.json({
    productos: productos.data,
    usuarios: usuarios.data
  });
});

app.listen(5000, () => console.log("Service Bus en 5000"));
