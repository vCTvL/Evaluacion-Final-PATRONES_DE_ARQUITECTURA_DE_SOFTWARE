
const amqp = require('amqplib');

const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const EXCHANGE_NAME = 'soa_exchange'; 
const EXCHANGE_TYPE = 'topic'; 

let connection = null;
let channel = null;


async function connect() {
    try {
        if (connection && !connection.closed) {
            console.log('conectado a RabbitMQ');
            return { connection, channel };
        }

        connection = await amqp.connect(AMQP_URL);
        channel = await connection.createChannel();
        
        // Declarar el exchange (type: 'topic' permite enrutamiento flexible)
        await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
        
        console.log(`Conectado a RabbitMQ en ${AMQP_URL}`);
        console.log(`Exchange '${EXCHANGE_NAME}' listo (type: ${EXCHANGE_TYPE})`);

        return { connection, channel };
    } catch (err) {
        console.error('Error conectando a RabbitMQ:', err.message);
        throw err;
    }
}

/**
 * Publicar un evento a RabbitMQ
 * @param {string} routingKey - clave de enrutamiento (p. ej. 'usuario.created')
 * @param {object} message - datos del evento
 */
async function publish(routingKey, message) {
    try {
        await connect();
        
        const messageBuffer = Buffer.from(JSON.stringify(message));
        channel.publish(
            EXCHANGE_NAME,
            routingKey,
            messageBuffer,
            { persistent: true } 
        );

        console.log(`📤 Evento publicado: ${routingKey}`);
    } catch (err) {
        console.error('❌ Error publicando evento:', err.message);
        throw err;
    }
}

/**
 * Consumir eventos desde una cola de RabbitMQ
 * @param {string} routingKeyPattern - patrón de enrutamiento (p. ej. 'usuario.*' escucha usuario.created, usuario.updated, etc.)
 * @param {function} handler - función que procesa el mensaje
 * @param {string} queueNamePrefix - prefijo para identificar la cola (default: nombre del archivo actual)
 */
async function consume(routingKeyPattern, handler, queueNamePrefix = 'consumer') {
    try {
        await connect(); // asegurar conexión activa

        // Crear una cola exclusiva (se borra al desconectar)
        const queue = await channel.assertQueue(queueNamePrefix + '_' + Date.now(), { exclusive: true });

        // Vincular la cola al exchange con el patrón de enrutamiento
        await channel.bindQueue(queue.queue, EXCHANGE_NAME, routingKeyPattern);

        console.log(`📥 Consumidor listo: escuchando '${routingKeyPattern}' en cola '${queue.queue}'`);

        // Procesar mensajes
        channel.consume(queue.queue, (msg) => {
            if (!msg) return;

            try {
                const content = JSON.parse(msg.content.toString());
                const routingKey = msg.fields.routingKey;
                
                console.log(`📨 Evento recibido: ${routingKey}`);
                
                // Llamar al handler (función que procesa el evento)
                handler(routingKey, content);

                // Acknowledge: confirmar que el mensaje fue procesado correctamente
                channel.ack(msg);
            } catch (err) {
                console.error('❌ Error procesando mensaje:', err.message);
                // Negative acknowledge: reencolar para reintentar
                channel.nack(msg, false, true);
            }
        });
    } catch (err) {
        console.error('❌ Error configurando consumidor:', err.message);
        throw err;
    }
}


async function disconnect() {
    try {
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log('✓ Desconectado de RabbitMQ');
    } catch (err) {
        console.error('❌ Error desconectando:', err.message);
    }
}

module.exports = { connect, publish, consume, disconnect };
