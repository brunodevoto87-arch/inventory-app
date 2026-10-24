require("dotenv").config();
const {Client} = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, description) VALUES
  ('Lácteos y Quesos', 'Leche, quesos, yogures'),
  ('Carnes', 'Asado, pollo, cerdo'),
  ('Bebidas', 'Gaseosas, aguas, jugos');

INSERT INTO items (name, description, price, stock, category_id) VALUES
  ('Leche Entera 1L', 'Leche entera de vaca', 1250.50, 50, 1),
  ('Queso Cremoso', 'Queso cremoso por kilo', 4500.00, 20, 1),
  ('Asado de Tira', 'Asado de tira por kilo', 8500.00, 15, 2),
  ('Coca-Cola 2.25L', 'Gaseosa Coca-Cola', 2500.00, 100, 3);
`;

async function main(){
    console.log("Seeding...");
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}
main();