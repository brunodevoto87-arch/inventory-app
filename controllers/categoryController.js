const pool = require("../db");

//Lista de categorias
exports.list = async (req, res) =>{
    try{
        const result = await pool.query("SELECT * FROM categories ORDER BY name");
        res.render("categories/list", {categories: result.rows});
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error en DB");
    }
};

//Detalle de categorias con sus items
exports.detail = async (req, res) =>{
    try{
        const {id} = req.params;
        const categoryResult = await pool.query(
            "SELECT * FROM categories WHERE id = $1",
            [id]
        );
        const itemsResult = await pool.query(
            "SELECT * FROM items WHERE category_id = $1 ORDER BY name",
            [id]
        );
        if (categoryResult.rows.length === 0){
            return res.status(404).send("Categoria no encontrada");
        }
        res.render("categories/details", {
            category: categoryResult.rows[0],
            items: itemsResult.rows,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error en DB");
    }
};

//Formulario para crear
exports.newGet = (req, res) =>{
    res.render("categories/form", {category: null, errors: [] });
};

//Crear categoria
exports.newPost = async (req, res) =>{
    try{
        const {name, description} = req.body;
        if (!name || name.trim().length === 0){
            return res.status(400).render("categories/form", {
                category: {name, description},
                errors: [{ msg: "El nombre es obligatorio"}],
            });
        }
        await pool.query(
            "INSERT INTO categories(name, description) VALUES ($1, $2)",
            [name.trim(), description?.trim() || null]
        );
        res.redirect("/categories");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error en DB");
    }
};

//Formulario de edicion
exports.editGet = async (req, res) =>{
    try{
        const {id} = req.params;
        const result = await pool.query(
            "SELECT * FROM categories WHERE id = $1", 
            [id]
        );
        if (result.rows.length === 0){
            return res.status(404).send("Categoria no encontrada");
        }
        res.render("categories/form", {
            category: result.rows[0],
            errors: [],
        });
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error en DB");
    }
};

//Actualizar categoria
exports.editPost = async (req, res) =>{
    try{
        const {id} = req.params;
        const {name, description} = req.body;
        if(!name || name.trim().length === 0){
            return res.status(400).render("categories/form", {
                category: {id, name, description},
                errors: [{ msg: "El nombre es obligatorio"}],
            });
        } 
        await pool.query(
            "UPDATE categories SET name = $1, description = $2 WHERE id = $3",
            [name.trim(), description?.trim() || null, id]
        );
        res.redirect("/categories");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};

//Confirmar eliminacion
exports.deleteGet = async (req, res) =>{
    try{
        const {id} = req.params;
        const result = await pool.query(
            "SELECT * FROM categories WHERE  id = $1", 
            [id]
        );
        if (result.rows.length === 0){
            return res.status(404).send("Categoria no encontrada");
        }
        res.render("categories/delete", {category: result.rows[0]});
    }
    catch(err){
        console.error(err)
            res.status(500).send("Error de DB");     
    };
}

// Eliminar categoria
exports.deletePost = async (req, res) =>{
    try{
        const {id} = req.params;
        await pool.query("DELETE FROM categories WHERE id = $1", [id]);
        res.redirect("/categories");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};