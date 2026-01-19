function migrate(DB) {
  DB.run(
    `
  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL
  )
`,
  );

  DB.run(
    `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    sender TEXT,
    currency TEXT NOT NULL,
    source_id INTEGER,
    FOREIGN KEY (source_id) REFERENCES sources(id)
  )
`,
  );
}

module.exports = { migrate };
