import { db } from "./db_connection";

const now = new Date();

const formattedDate = now
  .toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
  .replace(",", "")
  .replace(
    /(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s(\d{1,2}):(\d{2}):(\d{2})\s?(AM|PM)/i,
    "$3-$1-$2 $4:$5:$6 $7"
  );

const defaultCategory = {
  name: "General Products",
  date_created: formattedDate,
};

class Category {
  constructor(name, date_created) {
    (this.name = name), (this.date_created = date_created);
  }

  static async createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS  categories(
            id  INTEGER PRIMARY KEY,
            name    TEXT UNIQUE,
            date_created TEXT
         
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
    const name = category.name.toLowerCase();

    const res = await db.run(` INSERT INTO categories VALUES(?,?,?) `, [
      this.lastID,
      name,
      category.date_created,
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
      "UPDATE categories SET name=?,date_created=? WHERE id=?",
      [category.name, category.date_created, category.id]
    );

    return res;
  }

  static delete(id) {
    db.run(`DELETE FROM categories WHERE id = ${id}`);
    return console.log("item deleted");
  }
}

export default Category;
