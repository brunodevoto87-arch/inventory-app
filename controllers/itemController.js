const pool = require("../db")

//lista de items
exports.list = async (req, res) =>{
    try{
        //hacemos un join para traer el nombre de la categoria
        const result = await pool.query(`
            SELECT items. *, categories.name AS category_name FROM items
            LEFT JOIN categories ON items.category_id = categories.id ORDER BY items.name
            `);
            res.render("items/list", {items: result.rows});
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};

//Detalle de item
exports.detail = async (req, res) =>{
    try{
        const {id} = req.params;
        const result = await pool.query(`
            SELECT items. *, categories.name AS category_name FROM items
            LEFT JOIN categories ON items.category_id = categories.id WHERE items.id = $1`, [id]);

            if (result.rows.length === 0) return res.status(404).send("Item no encontrado");
            res.render("items/detail", {item: result.rows[0] });
    }
    catch (err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};

//Formulario para crear
exports.newGet = async (req, res) =>{
    try{
        const categories = await pool.query("SELECT * FROM categories ORDER BY name");
        res.render("items/form", {item: null, categories: categories.rows, errors: [] });
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};

//Crear item
exports.newPost = async (req, res) =>{
    try{
        const {name, description, price, stock, category_id} = req.body;
        if (!name || name.trim().length === 0){
            const categories = await pool.query("SELECT * FROM categories ORDER BY name");
            return res.status(400).render("items/form", {
                item: req.body,
                categories: categories.rows,
                errors: [{ msg: "El nombre es obligatorio"}],
            });
        }
        await pool.query(
            "INSERT INTO items (name, description, price, stock, category_id) VALUES ($1, $2, $3, $4, $5)",[name.trim(), description?.trim() || null, price || 0, stock || 0, category_id || null]
        );
        res.redirect("/items");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};

//Formulario de edicion
exports.editGet = async (req, res) =>{
    try{
        const {id} = req.params;
        const itemResult = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
        const categories = await pool.query("SELECT * FROM categories ORDER BY name");
        if (itemResult.rows.length === 0) return res.status(404).send("Item no encontrado");
        res.render("items/form", {
            item: itemResult.rows[0],
            categories: categories.rows,
            errors: [],
        });
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};

//Actualizar item
exports.editPost = async (req, res) =>{
    try{
        const {id} = req.params;
        const {name, description, price, stock, category_id} = req.body;
        await pool.query(
            "UPDATE items SET name = $1, description = $2, price = $3, stock = $4, category_id = $5 WHERE id = $6",
            [name.trim(), description?.trim() || null, price || 0, stock || 0, category_id || null, id]
        );
        res.redirect("/items");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};

//Confirmar Eliminacion
exports.deleteGet = async (req, res) =>{
    try{
        const {id} = req.params;
        const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
        if(result.rows.length === 0) return res.status(404).send("Item no encontrado");
        res.render("items/delete", {item: result.rows[0]});
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};

//Eliminar item
exports.deletePost = async (req, res)=>{
    try{
        const {id} = req.params;
        await pool.query("DELETE FROM items WHERE id = $1", [id]);
        res.redirect("/items");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
};

