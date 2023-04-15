import { db } from "./db_connection";

const defaultCustomer = {
  name: "Cash Customer",
  address: "N/A",
  phone: "0000000000",
  date_created: "N/A",
  date_modified: "N/A",
};

class Customer {
  constructor(name, address, phone, date_created, date_modified) {
    (this.name = name),
      (this.address = address),
      (this.phone = phone),
      (this.date_created = date_created),
      (this.date_modified = date_modified);
  }

  static async createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS  customers(
            id  INTEGER PRIMARY KEY,
            name    TEXT,
            address TEXT,
            phone TEXT,
            date_created TEXT,
            date_modified TEXT
        )`;
    await db.run(sql);

    let customers = await this.getAll();

    if (customers.length === 0) {
      await this.insert(defaultCustomer);
      console.log("Default customer inserted.");
    }
    console.log(`customers table created`);
  }

  static async insert(customer) {
    const res = await db.run(` INSERT INTO customers VALUES(?,?,?,?,?,?) `, [
      this.lastID,
      customer.name,
      customer.address,
      customer.phone,
      customer.date_created,
      customer.date_modified,
    ]);

    return res;
  }

  static async update(customer) {
    const res = await db.run(
      `UPDATE customers SET name=?, address=?, phone=? WHERE id=?`,
      [
        customer.name,
        customer.address,
        customer.phone,
        customer.date_created,
        customer.date_modified,
        customer.id,
      ]
    );
    return res;
  }

  static async getOne(customer) {
    const response = await db.run("SELECT * FROM customer WHERE id=?", [
      customer.id,
    ]);
    return response;
  }

  static getAll() {
    return db.all(`SELECT * FROM customers ORDER BY id DESC`);
  }

  static delete(customer) {
    db.run(`DELETE FROM customers WHERE id = ${customer}`);
    return console.log("item deleted");
  }
}

export default Customer;
