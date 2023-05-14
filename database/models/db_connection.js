const sqlite3 = require("sqlite3").verbose();
const os = require("os");
const fs = require("fs");

class DatabaseConnection {
  constructor(dbFilePath) {
    dbFilePath = os.homedir();

    //Make database directory if none
    if (!fs.existsSync(`${dbFilePath}/business_app`)) {
      fs.mkdirSync(`${dbFilePath}/business_app`);
    }

    //Create database if does not exit
    if (!fs.existsSync(`${dbFilePath}/business_app/database.sqlite`)) {
      fs.writeFileSync(`${dbFilePath}/business_app/database.sqlite`, "");
    }

    this.sqlitedb = new sqlite3.Database(
      `${dbFilePath}/business_app/database.sqlite`,
      (err) => {
        if (err) {
          console.log("Could not connect to database", err);
          return console.error(err.message);
        } else {
          console.log("connected to database");
        }
      }
    );

    this.sqlitedb.serialize(() => {});
  }

  run(sql, params) {
    return new Promise((resolve, reject) => {
      this.sqlitedb.run(sql, params, function (err) {
        if (err && err.message.includes("UNIQUE constraint failed")) {
          // const matches = err.message.match(
          //   /UNIQUE constraint failed: categories.(\w+)/
          // );
          console.log("Error running sql" + sql);
          console.log(err.message);
          const matches = err.message.match(
            /UNIQUE constraint failed: \w+\.(\w+)/
          );

          const columnName = matches[1];
          console.log(`columnname: ${columnName}`);

          return reject({
            error: err.name,
            message: err.message,
            // stack: err.stack,
            user_message: columnName,
          });
        }
        console.log(this.lastID);
        return resolve(this.lastID);
      });
    });
  }
  save(sql, params) {
    return new Promise((resolve, reject) => {
      this.sqlitedb.run(sql, params, function (err) {
        if (err) {
          // console.log("Error running sql" + sql);
          // console.log(err.message);

          return reject({
            error: err.name,
            message: err.message,
            stack: err.stack,
          });
        }
        console.log(this.lastID);
        return resolve(this.lastID);
      });
    });
  }

  serialized(sql, params) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        this.sqlitedb.run(sql, params, function (err, row) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          return resolve(row);
        });
      });
    });
  }

  update(sql, params) {
    return new Promise((resolve, reject) => {
      this.sqlitedb.run(sql, params, function (err) {
        if (err && err.message.includes("UNIQUE constraint failed")) {
          // console.log("Error running sql" + sql);
          // console.log(err.message);

          const matches = err.message.match(
            /UNIQUE constraint failed: \w+\.(\w+)/
          );

          const columnName = matches[1];
          // console.log(`columnname: ${columnName}`);

          return reject({
            error: err.name,
            message: err.message,
            // stack: err.stack,
            user_message: columnName,
          });
        }
        console.log(`this.changes is: ${this.changes}`);
        return resolve(this.changes);
      });
    });
  }

  // update(sql, params) {
  //   return new Promise((resolve, reject) => {
  //     this.sqlitedb.run(sql, params, function (err) {
  //       if (err) {
  //         console.log(err.message);
  //         return reject(err.message);
  //       }
  //       const rowsAffected = this.changes;
  //       return resolve(rowsAffected);
  //     });
  //   });
  // }

  get(sql, params) {
    return new Promise((resolve, reject) => {
      this.sqlitedb.get(sql, params, function (err, row) {
        if (err) {
          return reject(err);
        }
        return resolve(row);
      });
    });
  }

  all(sql, params) {
    return new Promise((resolve, reject) => {
      this.sqlitedb.all(sql, params, function (err, rows) {
        if (err) {
          return reject(err);
        }
        return resolve(rows);
      });
    });
  }
}

// module.exports = new DatabaseConnection();
export let db = new DatabaseConnection();
