import { db } from "./db_connection";

const defaultCategory = {
  name: "General Products",
  description: "Generic products",
  date_created: "N/A",
  date_modified: "N/A",
};

class Category {
  constructor(name, description, date_created, date_modified) {
    (this.name = name),
      (this.description = description),
      (this.date_created = date_created),
      (this.date_modified = date_modified);
  }

  static async createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS  categories(
            id  INTEGER PRIMARY KEY,
            name    TEXT UNIQUE,
            description TEXT UNIQUE,
            date_created TEXT,
            date_modified TEXT
        )`;
    await db.run(sql);

    let categories = await this.getAll();

    if (categories.length === 0) {
      await this.insert(defaultCategory);
      console.log("Default category inserted.");
    }

    console.log(defaultCategory);
    console.log("categories table created");
  }

  static async countCategories() {
    const res = await db.get(`SELECT COUNT(*) AS count from categories`);
    console.log(`count: ${res.count}`);
    return res.count;
  }

  static async insert(category) {
    const res = await db.run(` INSERT INTO categories VALUES(?,?,?,?,?) `, [
      this.lastID,
      category.name,
      category.description,
      category.date_created,
      category.date_modified,
    ]);

    const insertedCategory = await db.get(
      `SELECT * FROM categories WHERE id = ?`,
      res
    );

    return insertedCategory;
  }

  static getAll() {
    return db.all(`SELECT * FROM categories`);
  }

  static async update(category) {
    const res = await db.update(
      "UPDATE categories SET name=?,description=?,date_created=?,date_modified=? WHERE id=?",
      [
        category.name,
        category.description,
        category.date_created,
        category.date_modified,
        category.id,
      ]
    );

    return res;
  }

  static delete(id) {
    db.run(`DELETE FROM categories WHERE id = ${id}`);
    return console.log("item deleted");
  }
}

export default Category;
