

const amqpClient = require('../../service-bus/amqpClient');


async function startConsumingUserEvents() {
    try {
        await amqpClient.consume(
            'usuario.*', // patrón: escucha usuario.created, usuario.updated, usuario.deleted, etc.
            handleUserEvent,
            'prestamos_consumer'
        );

        console.log('✓ Consumidor de eventos de usuarios iniciado');
    } catch (err) {
        console.error('Error iniciando consumidor:', err);
    }
}

/**
 * Procesar evento cuando se recibe
 * @param {string} routingKey - tipo de evento (p. ej. 'usuario.created')
 * @param {object} data - datos del evento
 */
function handleUserEvent(routingKey, data) {
    console.log(`\n[CONSUMER] Evento recibido: ${routingKey}`);
    console.log(`Usuario: ${data.nombre} (${data.email})`);
    console.log(`Rol: ${data.rol}`);

    switch (routingKey) {
        case 'usuario.created':
            
            console.log(`Se podría crear un registro de préstamo inicial para este usuario`);
            
            break;

        case 'usuario.updated':
            console.log(`Se podría actualizar datos del usuario en los préstamos`);
            break;

        case 'usuario.deleted':
            console.log(`Se podría archivar los préstamos de este usuario`);
            break;

        default:
            console.log(`Evento no manejado`);
    }
}

module.exports = { startConsumingUserEvents };
