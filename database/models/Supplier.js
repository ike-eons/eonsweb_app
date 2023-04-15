import { db } from "./db_connection";

class Supplier {
  constructor(company_name, address, phone, email, date_create, date_modified) {
    (this.company_name = company_name),
      (this.address = address),
      (this.phone = phone),
      (this.email = email),
      (this.date_create = date_create),
      (this.date_modified = date_modified);
  }

  static createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS  supplier(
            id  INTEGER PRIMARY KEY,
            company_name    TEXT,
            address TEXT,
            phone TEXT,
            email TEXT,
            date_created TEXT,
            date_modified TEXT
        )`;

    return db.run(sql);
  }

  static async insert(supplier) {
    const res = await db.run(` INSERT INTO suppliers VALUES(?,?,?,?,?,?,?) `, [
      this.lastID,
      supplier.company_name,
      supplier.address,
      supplier.phone,
      supplier.email,
      supplier.date_created,
      supplier.date_modified,
    ]);
  }

  static async getId(supplier) {
    const res = db.get(`SELECT * FROM suppliers where id=?`, supplier.id);
  }

  static async update(supplier) {
    const res = await db.update(
      `UPDATE suppliers SET company_name=?, address=?, phone=?, email=?,date_created=?, date_modified=? WHERE id=?`,
      [
        supplier.company_name,
        supplier.address,
        supplier.email,
        supplier.phone,
        supplier.date_created,
        supplier.date_modified,
        supplier.id,
      ]
    );
  }

  static getAll() {
    return db.all(`SELECT * FROM suppliers`);
  }

  static delete(id) {
    db.run(`DELETE FROM suppliers WHERE id = ${id}`);
    return console.log("item deleted");
  }
}

export default Supplier;
