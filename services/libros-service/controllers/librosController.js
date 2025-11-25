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