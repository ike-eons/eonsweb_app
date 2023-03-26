import { db } from "./db_connection";

class Category {
  constructor(name, description, date_created, date_modified) {
    (this.name = name),
      (this.description = description),
      (this.date_created = date_created),
      (this.date_modified = date_modified);
  }

  static createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS  categories(
            id  INTEGER PRIMARY KEY,
            name    TEXT,
            description TEXT,
			date_created TEXT,
			date_modified TEXT
        )`;
    console.log("categories table created");
    return db.run(sql);
  }

  static async insert(category) {
    await db.run(` INSERT INTO categories VALUES(?,?,?,?,?) `, [
      this.lastID,
      category.name,
      category.description,
      category.date_created,
      category.date_modified,
    ]);
  }

  static getAll() {
    return db.all(`SELECT * FROM categories`);
  }

  static async update(category) {
    return db.run(
      "UPDATE categories SET name=?,description=?,date_create=?,date_modified=? WHERE id=?",
      [
        category.name,
        category.description,
        category.date_created,
        category.date_modified,
        category.id,
      ]
    );
  }

  static delete(id) {
    db.run(`DELETE FROM categories WHERE id = ${id}`);
    return console.log("item deleted");
  }
}

export default Category;
