exports.obtenerLibros = async (req, res) => {
    try {
        const response = await fetch("http://localhost:3002/libros");
        if (!response.ok) throw new Error("Servicio 3002 falló");
        const libros = await response.json();
        res.json(libros);
    } catch (err) {
        console.error("Error al obtener libros:", err);
        res.status(500).json({ error: "Error al obtener libros" });
    }
};

exports.crearLibro = async (req, res) => {
    try {
        const { titulo, autor, categoria, formato, sinopsis } = req.body;

        const response = await fetch("http://localhost:3002/crearLibro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({titulo, autor, categoria, formato, sinopsis })
        });

        if (!response.ok) throw new Error("Servicio 3002 falló");

        const data = await response.json();
        res.status(201).json(data);
    } catch (err) {
        console.error("Error al crear libro:", err);
        res.status(500).json({ error: "Error al crear libro" });
    }
};

exports.modificarLibro = async (req,res) => {
    try{
    const { id } = req.params;
    
    const { titulo, autor, categoria, formato, sinopsis } = req.body;
    
    const response = await fetch(`http://localhost:3002/modificarLibro/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({titulo, autor, categoria, formato, sinopsis })
    });

    if (!response.ok) throw new Error("Servicio 3002 falló");

    const data = await response.json();
    res.status(201).json(data);
    } catch (err) {
    console.error("Error al crear libro:", err);
    res.status(500).json({ error: "Error al crear libro" });
    }
}

exports.eliminarLibro = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID recibido para eliminar:", id);
        const response = await fetch(`http://localhost:3002/eliminarLibro/${id}`, {
            method: "DELETE",
            
            

        });
        if (!response.ok) throw new Error("Servicio 3002 falló");

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error("Error al eliminar libro:", err);
        res.status(500).json({ error: "Error al eliminar libro" });
    }

};