const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { isBundle, exeDir, dbPath, externalSQliteBinaryPath } = require("../../constants");

class _DB {
  constructor(dbPath, sqliteBinaryPath) {
    if (fs.existsSync(path.join(exeDir, "db")) === false) {
      fs.mkdirSync(path.join(exeDir, "db"));
    }
    this.db = new Database(dbPath, {
      nativeBinding: isBundle ? sqliteBinaryPath : undefined,
    });

    this.db.pragma("journal_mode = WAL");
    this.db.pragma("synchronous = NORMAL");
  }

  run(sql, params = []) {
    return this.db.prepare(sql).run(...params);
  }

  prepare(sql) {
    return this.db.prepare(sql);
  }

  transaction(sqls) {
    const transaction = this.db.transaction(() => {
      for (const sql of sqls) {
        this.db.prepare(sql[0]).run(...sql[1]);
      }
    });
    return transaction;
  }

  close() {
    this.db.close();
  }
}

const DB = new _DB(dbPath, externalSQliteBinaryPath);

module.exports = { DB };
