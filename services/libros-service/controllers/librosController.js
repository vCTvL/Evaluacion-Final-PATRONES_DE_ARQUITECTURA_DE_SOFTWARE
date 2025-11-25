const repo = require("../repository/librosRepo");

exports.obtenerLibros = async (req, res) => {
    try {
        const libros = await repo.obtenerLibros();
        res.json(libros);
    } catch (error) {
        console.error("Error al obtener libros:", error);
        res.status(500).json({ error: "Error al obtener libros" });
    }
};

exports.crearLibro = async (req,res) => {

    try{
        const { titulo , autor, categoria , formato , sinopsis } = req.body;
        const libro = await repo.crearLibro(titulo, autor, categoria, formato, sinopsis);
        res.status(201).json({message: "LIBRO AGREGADO CORRECTAMENTE", libro});
    }catch(error){
        console.error("ERROR AL AGREGAR LIBRO: ", error);
        res.status(500).send("ERROR AL AGREGAR UN LIBRO")
    }
};

exports.modificarLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, autor, categoria, formato, sinopsis } = req.body;
        
        
        const exito = await repo.modificarLibro(id, titulo, autor, categoria, formato, sinopsis);
        if (exito) {
            res.json({ message: "LIBRO MODIFICADO CORRECTAMENTE" });
        } else {
            res.status(404).json({ error: "LIBRO NO ENCONTRADO" });
        }
    } catch (error) {
        console.error("ERROR AL MODIFICAR LIBRO: ", error);
        res.status(500).json({ error: "ERROR AL MODIFICAR LIBRO" });
    }

};

exports.eliminarLibro = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const exito = await repo.eliminarLibro(id);
        if (exito) {
            res.json({ message: "LIBRO ELIMINADO CORRECTAMENTE" });
        } else {
            res.status(404).json({ error: "LIBRO NO ENCONTRADO" });
        }
    } catch (error) {
        console.error("ERROR AL ELIMINAR LIBRO: ", error);
        res.status(500).json({ error: "ERROR AL ELIMINAR LIBRO" });
    }
};