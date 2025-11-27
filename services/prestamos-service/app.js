const express = require('express');
const cors = require('cors');
const path = require('path');
const prestamosRoutes = require('./routes/prestamosRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/prestamos', prestamosRoutes);

// Ruta principal para servir el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'prestamos.html'));
});

app.listen(3003, () => {
    console.log('Prestamos Service escuchando en el puerto 3003');
});

module.exports = app;