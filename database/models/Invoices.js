import { db } from "./db_connection";
import InvoiceItems from "./InvoiceItems";
import Payment from "./Payments";

class Invoice {
  constructor(employee_id, customer_id, total, date_created) {
    (this.employee_id = employee_id),
      (this.customer_id = customer_id),
      (this.total = total),
      (this.date_created = date_created);
  }

  static createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS  invoices(
            id  INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER,
            customer_id INTEGER,
            total FLOAT,
            date_created TEXT 
        )`;
    console.log(`invoice table created`);
    return db.run(sql);
  }

  // static async insert1(invoice) {
  //   invoice.employee_id = 1;

  //   const res = await db.run(` INSERT INTO invoices VALUES(?,?,?,?,?) `, [
  //     this.lastID,
  //     invoice.customer_id,
  //     invoice.employee_id,
  //     invoice.total,
  //     invoice.date_created,
  //   ]);

  //   console.log(`invoice id ${res}`);

  //   invoice.invoice_items.forEach((item) => {
  //     item.invoice_id = res;

  //     const result = InvoiceItems.insert(item)
  //       .then((result) => {
  //         console.log(result);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   });

  //   // console.log(insertInvoiceItem);
  // }

  static async insert(invoice) {
    return db.sqlitedb.run("BEGIN TRANSACTION", async () => {
      try {
        // Insert a new row into the invoices table and get its id
        const invoiceResult = await db.run(
          `INSERT INTO invoices VALUES(?,?,?,?,?)`,
          [
            this.lastID,
            invoice.customer_id,
            invoice.employee_id,
            invoice.total,
            invoice.date_created,
          ]
        );

        invoice.id = invoiceResult;

        console.log(`invoice id ${invoiceResult}`);

        // Insert a new row into the invoice_items table for each item, using the invoiceId value
        invoice.invoice_items.forEach((item) => {
          item.invoice_id = invoiceResult;

          const result = InvoiceItems.insert(item)
            .then((result) => {
              console.log(result);
            })
            .catch((error) => {
              console.log(error);
            });
        });

        Payment.insert(invoice);

        // Commit the transaction
        await db.sqlitedb.run("COMMIT");
        return invoice.id;
      } catch (err) {
        await db.sqlitedb.run("ROLLBACK");
        console.log(err);
      }
    });
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
