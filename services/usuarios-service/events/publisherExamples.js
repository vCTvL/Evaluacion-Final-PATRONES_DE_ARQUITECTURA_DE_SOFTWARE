
const amqpClient = require('../../service-bus/amqpClient');


 //Publicar evento: usuario creado
 //Se llama DESPUÉS de que el usuario se inserte en la base de datos
 
async function publishUserCreated(usuario) {
    try {
        await amqpClient.publish('usuario.created', {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            timestamp: new Date().toISOString()
        });

        console.log(`✓ Evento 'usuario.created' publicado para: ${usuario.nombre}`);
    } catch (err) {
        console.error('Error al publicar evento usuario.created:', err);
       
    }
}

module.exports = { publishUserCreated };
