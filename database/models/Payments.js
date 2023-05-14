import { db } from "./db_connection";

class Payment {
  constructor(invoice_id, customer_id, amount_paid, payment_type) {
    (this.invoice_id = invoice_id),
      (this.customer_id = customer_id),
      (this.amount_paid = amount_paid),
      (this.payment_type = payment_type);
  }

  static createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS  payments(
            invoice_id INTEGER,
            customer_id INTEGER,
            amount_paid DOUBLE,
            payment_type TEXT,
            FOREIGN KEY(invoice_id)
                REFERENCES invoices(id)
            FOREIGN KEY(customer_id)
                REFERENCES  customers(id)
        )`;
    console.log(`Payments table created`);
    return db.run(sql);
  }

  static async insert(invoice) {
    db.run(`INSERT INTO payments VALUES(?,?,?,?)`, [
      invoice.invoice_id,
      invoice.customer_id,
      invoice.amount_paid,
      invoice.payment_type,
    ]);
  }

  static getAll() {
    return db.all("SELECT * FROM  payments");
  }

  static delete(id) {
    db.run(`DELETE FROM payments WHERE id = ${id}`);
    return console.log("payment deleted");
  }
}

export default Payment;
