// URL base de los microservicios
const API_PRESTAMOS_URL = 'http://localhost:3003/prestamos';
const API_LIBROS_URL = 'http://localhost:3002/libros'; // Ajusta el puerto de tu microservicio de libros

let todosLosLibros = []; // Para el filtro de búsqueda

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarPrestamosActivos();
    cargarHistorial();
    cargarLibrosDisponibles();
    
    // Event listeners
    document.getElementById('formPrestar').addEventListener('submit', prestarLibro);
    document.getElementById('buscarLibro').addEventListener('input', filtrarLibros);
});

// Función para prestar un libro
async function prestarLibro(e) {
    e.preventDefault();
    
    const libroId = document.getElementById('libroId').value;
    const usuarioNombre = document.getElementById('usuarioNombre').value;
    
    try {
        const response = await fetch(API_PRESTAMOS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                libro_id: libroId,
                usuario_nombre: usuarioNombre
            })
        });
        
        if (response.ok) {
            alert('✅ Libro prestado exitosamente');
            document.getElementById('formPrestar').reset();
            cargarPrestamosActivos();
            cargarHistorial();
            cargarLibrosDisponibles(); // Actualizar estado de libros
        } else {
            const error = await response.json();
            alert('❌ Error: ' + (error.message || 'No se pudo prestar el libro'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión con el servidor');
    }
}

// Función para cargar préstamos activos
async function cargarPrestamosActivos() {
    try {
        const response = await fetch(`${API_PRESTAMOS_URL}/activos`);
        const prestamos = await response.json();
        
        const tbody = document.querySelector('#tablaPrestamosActivos tbody');
        
        if (prestamos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-message">No hay préstamos activos</td></tr>';
            return;
        }
        
        tbody.innerHTML = prestamos.map(prestamo => `
            <tr>
                <td>${prestamo.id}</td>
                <td>${prestamo.libro_id}</td>
                <td>${prestamo.usuario_nombre}</td>
                <td>${formatearFecha(prestamo.fecha_prestamo)}</td>
                <td>
                    <button class="btn btn-danger" onclick="devolverLibro(${prestamo.id})">
                        Devolver
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar préstamos activos:', error);
    }
}

// Función para cargar historial completo
async function cargarHistorial() {
    try {
        const response = await fetch(API_PRESTAMOS_URL);
        const prestamos = await response.json();
        
        const tbody = document.querySelector('#tablaHistorial tbody');
        
        if (prestamos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-message">No hay historial de préstamos</td></tr>';
            return;
        }
        
        tbody.innerHTML = prestamos.map(prestamo => `
            <tr>
                <td>${prestamo.id}</td>
                <td>${prestamo.libro_id}</td>
                <td>${prestamo.usuario_nombre}</td>
                <td>${formatearFecha(prestamo.fecha_prestamo)}</td>
                <td>${prestamo.fecha_devolucion ? formatearFecha(prestamo.fecha_devolucion) : '-'}</td>
                <td>
                    <span class="badge badge-${prestamo.estado}">
                        ${prestamo.estado.toUpperCase()}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar historial:', error);
    }
}

// Función para cargar libros disponibles
async function cargarLibrosDisponibles() {
    try {
        // Obtener todos los libros
        const responseLibros = await fetch(API_LIBROS_URL);
        const libros = await responseLibros.json();
        
        // Obtener préstamos activos para verificar disponibilidad
        const responsePrestamos = await fetch(`${API_PRESTAMOS_URL}/activos`);
        const prestamosActivos = await responsePrestamos.json();
        
        // IDs de libros prestados
        const librosPrestados = prestamosActivos.map(p => p.libro_id);
        
        // Agregar estado de disponibilidad
        todosLosLibros = libros.map(libro => ({
            ...libro,
            disponible: !librosPrestados.includes(libro.id)
        }));
        
        mostrarLibros(todosLosLibros);
    } catch (error) {
        console.error('Error al cargar libros:', error);
        const tbody = document.querySelector('#tablaLibros tbody');
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">Error al cargar libros</td></tr>';
    }
}

// Función para mostrar libros en la tabla
function mostrarLibros(libros) {
    const tbody = document.querySelector('#tablaLibros tbody');
    
    if (libros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">No se encontraron libros</td></tr>';
        return;
    }
    
    tbody.innerHTML = libros.map(libro => `
        <tr>
            <td><strong>${libro.id}</strong></td>
            <td>${libro.titulo || libro.Titulo || 'Sin título'}</td>
            <td>${libro.autor || libro.Autor || 'Sin autor'}</td>
            <td>
                <span class="badge ${libro.disponible ? 'badge-disponible' : 'badge-prestado'}">
                    ${libro.disponible ? 'DISPONIBLE' : 'PRESTADO'}
                </span>
            </td>
        </tr>
    `).join('');
}

// Función para filtrar libros
function filtrarLibros(e) {
    const busqueda = e.target.value.toLowerCase();
    
    const librosFiltrados = todosLosLibros.filter(libro => {
        const titulo = (libro.titulo || libro.Titulo || '').toLowerCase();
        const autor = (libro.autor || libro.Autor || '').toLowerCase();
        return titulo.includes(busqueda) || autor.includes(busqueda);
    });
    
    mostrarLibros(librosFiltrados);
}

// Función para devolver un libro
async function devolverLibro(id) {
    if (!confirm('¿Confirmar devolución de este libro?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_PRESTAMOS_URL}/${id}/devolver`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            alert('✅ Libro devuelto exitosamente');
            cargarPrestamosActivos();
            cargarHistorial();
            cargarLibrosDisponibles(); // Actualizar estado de libros
        } else {
            alert('❌ Error al devolver el libro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error de conexión con el servidor');
    }
}

// Función auxiliar para formatear fechas
function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}