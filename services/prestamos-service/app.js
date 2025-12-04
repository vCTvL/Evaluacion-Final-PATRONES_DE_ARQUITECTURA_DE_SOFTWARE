const express = require('express');
const cors = require('cors');
const path = require('path');
const prestamosRoutes = require('./routes/prestamosRoutes');

const app = express();


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

// ============ BROKER PATTERN: CONSUMER ============
const amqpClient = require('../../service-bus/amqpClient');

(async () => {
    try {
        await amqpClient.consume(
            'usuario.*',  
            (routingKey, data) => {
                console.log(`\n📨 EVENTO RECIBIDO: ${routingKey}`);
                console.log(`🎯 NUEVO USUARIO REGISTRADO VÍA BROKER:`);
                console.log(`   - Nombre: ${data.nombre}`);
                console.log(`   - Email: ${data.email}`);
                console.log(`   - Rol: ${data.rol}\n`);
                
            },
            'prestamos_consumer'
        );
        console.log('✓ Consumer conectado al Broker (RabbitMQ)');
    } catch (err) {
        console.warn('⚠️  No se pudo iniciar consumer del Broker:', err.message);
    }
})();
// ===================================================

app.listen(3003, () => {
    console.log('Prestamos Service escuchando en el puerto 3003');
});

module.exports = app;