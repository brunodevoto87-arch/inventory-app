require("dotenv").config();
const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

//1-Configuracion de vistas
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//2-Midlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//3-Routers
const itemRouter = require("./routes/itemRouter");
const categoryRouter = require("./routes/categoryRouter");
app.use("/categories", categoryRouter);
app.use("/items", itemRouter);

//4-Ruta principal
app.get("/", async (req, res)=>{
    try{
        const result = await pool.query("SELECT * FROM categories ORDER BY name");
        res.render("index", {categories: result.rows});
    }
    catch (err){
        console.error(err);
        res.status(500).send("Error de DB");
    }
});
app.listen(PORT, ()=>{
    console.log(`Servidor en http://localhost: ${PORT}`);
});
