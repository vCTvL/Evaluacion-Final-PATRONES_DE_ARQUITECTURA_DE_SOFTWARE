// Estado global de libros
let libros = [];
let librosFiltrados = [];

// Cargar libros desde la base de datos
async function cargarLibros() {
    try {
        const response = await fetch("/libros");
        if (!response.ok) throw new Error("Error al cargar libros");
        libros = await response.json();
        librosFiltrados = libros;
        renderizarTabla();
        actualizarEstadisticas();
    } catch (error) {
        console.error("Error al cargar libros:", error);
        libros = [];
        librosFiltrados = [];
        renderizarTabla();
        actualizarEstadisticas();
    }
}

// Renderizar la tabla con los libros
function renderizarTabla() {
    const tbody = document.getElementById("tabla-libros");
    if (!tbody) return;

    if (librosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#666;">No hay libros registrados</td></tr>';
        return;
    }

    tbody.innerHTML = librosFiltrados.map(libro => `
        <tr>
            <td>${libro.id || '-'}</td>
            <td>${libro.titulo || '-'}</td>
            <td>${libro.autor || '-'}</td>
            <td>${libro.categoria || '-'}</td>
            <td>${libro.formato || '-'}</td>
        </tr>
    `).join('');
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const totalLibros = document.getElementById("total-libros");
    const librosDigitales = document.getElementById("libros-digitales");
    
    if (totalLibros) {
        totalLibros.textContent = libros.length;
    }
    
    if (librosDigitales) {
        const digitales = libros.filter(l => l.formato === "Digital").length;
        librosDigitales.textContent = digitales;
    }
}

// Filtrar libros
function filtrarLibros(termino) {
    if (!termino.trim()) {
        librosFiltrados = libros;
    } else {
        const busqueda = termino.toLowerCase();
        librosFiltrados = libros.filter(libro => 
            (libro.titulo && libro.titulo.toLowerCase().includes(busqueda)) ||
            (libro.autor && libro.autor.toLowerCase().includes(busqueda)) ||
            (libro.categoria && libro.categoria.toLowerCase().includes(busqueda))
        );
    }
    renderizarTabla();
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    // Cargar libros al iniciar
    cargarLibros();

    // Manejar formulario de creación
    const form = document.getElementById("form-crear");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const titulo = document.getElementById("titulo").value;
            const autor = document.getElementById("autor").value;
            const categoria = document.getElementById("categoria").value;
            const formato = document.getElementById("formato").value;
            const sinopsis = document.getElementById("sinopsis").value;

            try {
                const response = await fetch("/libros", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ titulo, autor, categoria, formato, sinopsis })
                });

                if (response.ok) {
                    // Limpiar formulario
                    form.reset();
                    
                    // Recargar libros y actualizar tabla
                    await cargarLibros();
                    
                    // Mostrar mensaje de éxito
                    alert("Libro agregado correctamente");
                } else {
                    alert("Error al crear libro");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                alert("Error en la conexión con el servidor");
            }
        });
    }

    // Manejar filtro de búsqueda
    const filtro = document.getElementById("filtro");
    if (filtro) {
        filtro.addEventListener("input", (e) => {
            filtrarLibros(e.target.value);
        });
    }
});

// Función para modificar un libro
async function modificarLibro() {
    const btnActualizar = document.getElementById("btn-actualizar");

    btnActualizar.addEventListener("click", async () => {

        const id = document.getElementById("editar-id").value;
        const titulo = document.getElementById("editar-titulo").value;
        const autor = document.getElementById("editar-autor").value;
        const categoria = document.getElementById("editar-categoria").value;
        const formato = document.getElementById("editar-formato").value;

        if (!id) {
            alert("Debes ingresar un ID para modificar.");
            return;
        }

        const datosActualizados = {};

        if (titulo) datosActualizados.titulo = titulo;
        if (autor) datosActualizados.autor = autor;
        if (categoria) datosActualizados.categoria = categoria;
        if (formato) datosActualizados.formato = formato;

        try {
            const response = await fetch(`/libros/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosActualizados)
            });

            if (response.ok) {
                alert("Libro actualizado correctamente");
                await cargarLibros();

                // Limpiar campos de edición
                document.getElementById("editar-id").value = "";
                document.getElementById("editar-titulo").value = "";
                document.getElementById("editar-autor").value = "";
                document.getElementById("editar-categoria").value = "";
                document.getElementById("editar-formato").value = "";
            } else {
                alert("Error al actualizar libro");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en la conexión con el servidor");
        }
    });
}

modificarLibro();

const btnEliminar = document.getElementById("btn-eliminar");
    btnEliminar.addEventListener("click", async () => {
        const id = document.getElementById("editar-id").value;
        console.log("ID a eliminar:", id);
        if (!id) {
            alert("Debes ingresar un ID para modificar.");
            return;
        }
        try {
            const response = await fetch(`/libros/${id}`, {
                method: "DELETE"      
            });
            console.log(response);
            if (response.ok) {
                alert("Libro eliminado correctamente");
                await cargarLibros();
                // Limpiar campos de edición
                document.getElementById("editar-id").value = "";
                document.getElementById("editar-titulo").value = "";
                document.getElementById("editar-autor").value = "";
                document.getElementById("editar-categoria").value = "";
                document.getElementById("editar-formato").value = "";
            } else {
                alert("Error al eliminar libro");
            }   
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en la conexión con el servidor");
        }
    });