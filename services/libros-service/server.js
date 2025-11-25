const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const librosRoutes = require("./routes/librosRoutes");


app.use("/", librosRoutes);

app.listen(3002, () => console.log("SOA Productos en 3002"));
