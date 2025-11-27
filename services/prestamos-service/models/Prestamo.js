class Prestamo {
    constructor(id, libro_id, usuario_nombre, fecha_prestamo, fecha_devolucion, estado) {
        this.id = id;
        this.libro_id = libro_id;
        this.usuario_nombre = usuario_nombre;
        this.fecha_prestamo = fecha_prestamo;
        this.fecha_devolucion = fecha_devolucion;
        this.estado = estado || 'activo';
    }

    // Método para verificar si el préstamo está activo
    estaActivo() {
        return this.estado === 'activo';
    }

    // Método para verificar si el préstamo fue devuelto
    estaDevuelto() {
        return this.estado === 'devuelto';
    }

    // Método para obtener los días que lleva prestado
    diasPrestado() {
        const fechaInicio = new Date(this.fecha_prestamo);
        const fechaFin = this.fecha_devolucion 
            ? new Date(this.fecha_devolucion) 
            : new Date();
        
        const diferencia = fechaFin - fechaInicio;
        return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    }
}

module.exports = Prestamo;