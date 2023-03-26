import { db } from "./db_connection";

class Product {
  constructor(
    description,
    stock_price,
    sales_price,
    category_id,
    date_created,
    date_modified
  ) {
    (this.description = description),
      (this.stock_price = stock_price),
      (this.sales_price = sales_price),
      (this.category_id = category_id),
      (this.date_created = date_created),
      (this.date_modified = date_modified);
  }

  static createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS  products(
            id  INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            stock_price FLOAT,
            sales_price FLOAT,
            date_created TEXT,
            date_modified TEXT,
            category_id INTEGER,
            FOREIGN KEY(category_id)
                REFERENCES categories(id)
        )`;
    console.log(`products table created`);
    return db.run(sql);
  }

  static insert(
    description,
    stock_price,
    sales_price,
    category_id,
    date_created,
    date_modified
  ) {
    return db.run(` INSERT INTO products VALUES(?,?,?,?,?,?,?) `, [
      this.lastID,
      description,
      stock_price,
      sales_price,
      category_id,
      date_created,
      date_modified,
    ]);
  }

  static getOne(product) {
    return db.run(`SELECT * from products WHERE id=?`[product.id]);
  }
  static getAll() {
    return db.all(`SELECT * FROM products`);
  }

  static async getLastId() {
    const res = await db.get(
      `SELECT id FROM products ORDER BY id desc limit 1`,
      []
    );
    return res;
  }

  static delete(id) {
    db.run(`DELETE FROM products WHERE id = ${id}`);
    return console.log("item deleted");
  }
}

export default Product;
