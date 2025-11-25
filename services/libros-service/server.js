const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let productos = [
  { id: 1, nombre: "Tablet" }
];

app.get("/productos", (req, res) => res.json(productos));

app.listen(5001, () => console.log("SOA Productos en 5001"));
