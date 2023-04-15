import { db } from "./db_connection";

class Invoice {
  constructor(employee_id, total, customer_id, date_created, date_modified) {
    (this.total = total),
      (this.employee_id = employee_id),
      (this.customer_id = customer_id),
      (this.date_created = date_created),
      (this.date_modified = date_modified);
  }

  static async createTable() {
    let sql = await `CREATE TABLE IF NOT EXISTS  invoices(
            id  INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            employee_id INTEGER,
            total    FLOAT,
            date_created TEXT,
            date_modified TEXT,
            
        )`;

    return db.run(sql);
  }

  static async insert(invoice) {
    const res = await db.run(` INSERT INTO invoices VALUES(?,?,?,?,?) `, [
      this.lastID,
      invoice.total,
      invoice.employee_id,
      invoice.date_created,
      invoice.date_modified,
    ]);
    return res;
  }

  static getAll() {
    return db.all(`SELECT * FROM invoices`);
  }

  static show(id) {
    let invoice = db.get(
      `SELECT * FROM invoices where id=?`,
      [id],
      (err, row) => {
        if (err) {
          return console.log(err);
        }
      }
    );
    return invoice;
  }

  static delete(id) {
    db.run(`DELETE FROM invoices WHERE id = ${id}`);
    return console.log("item deleted");
  }

  static async getLastId() {
    const res = await db.get(
      `SELECT id FROM invoices ORDER BY id desc limit 1`,
      [],
      (err, row) => {
        if (err) {
          return console.log(err);
        }
        return console.log(row);
      }
    );

    return res;
  }
}

//generate a 10-digit reference number(1000000000 - 9999999999)
async function referenceCode() {
  const code = Math.floor(1000000000 + Math.random() * 9000000000);
  return code.toString();
}

export default Invoice;
