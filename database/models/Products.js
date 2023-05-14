import { db } from "./db_connection";

class Product {
  constructor(
    description,
    stock_price,
    sales_price,
    category_id,
    date_created
  ) {
    (this.description = description),
      (this.stock_price = stock_price),
      (this.sales_price = sales_price),
      (this.category_id = category_id),
      (this.date_created = date_created);
  }

  static createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS  products(
            id  INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT UNIQUE,
            stock_price FLOAT,
            sales_price FLOAT,
            category_id INTEGER,
            date_created TEXT,
            FOREIGN KEY(category_id)
                REFERENCES categories(id)
        )`;
    console.log(`products table created`);
    return db.run(sql);
  }

  static async insert(product) {
    const description = product.description.toLowerCase();
    const res = await db.run(` INSERT INTO products VALUES(?,?,?,?,?,?) `, [
      this.lastID,
      description,
      product.stock_price,
      product.sales_price,
      product.category_id,
      product.date_created,
    ]);

    console.log(`product model ressss`);
    console.log(res);
    console.log(`product model ressss`);

    const insertedProduct = await db.get(
      `SELECT * FROM products WHERE id = ?`,
      res
    );

    return insertedProduct;
  }

  // Get a single product
  static async getOne(product) {
    try {
      const data = db.get(`SELECT * from products WHERE id=?`[product.id]);
      return data;
    } catch (err) {
      return err.user_message;
    }
  }
  static async getAll() {
    const res = await db.all(`SELECT * FROM products`);
    return res;
  }

  //Update product
  static async update(product) {
    try {
      const res = await db.update(
        `
      UPDATE products SET description=?, stock_price=?, sales_price=?, category_id=?, date_created=? WHERE id=?`,
        [
          product.description,
          product.stock_price,
          product.sales_price,
          product.category_id,
          product.date_created,
          product.id,
        ]
      );

      let updatedProduct = {};
      if (res === 1) {
        updatedProduct = await db.get(
          `SELECT * FROM products WHERE id = ?`,
          product.id
        );

        return updatedProduct;
      }
    } catch (err) {
      throw err;
    }
  }

  static delete(id) {
    db.run(`DELETE FROM products WHERE id = ${id}`);
    return console.log("item deleted");
  }
}

export default Product;
