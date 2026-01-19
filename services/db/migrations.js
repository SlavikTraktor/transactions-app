function migrate(DB) {
  DB.run(
    `
  CREATE TABLE IF NOT EXISTS sources (
    name TEXT NOT NULL,
    type TEXT NOT NULL UNIQUE
  )
`,
  );

  try {
    DB.run(
      `
      DELETE FROM sources WHERE type in ('bog', 'bog_business')
      `,
    );
    DB.run(
      `
      INSERT OR IGNORE INTO sources (name, type) VALUES
        ('Бог', 'bog'),
        ('Бог бизнес', 'bog_business')
      `,
    );
  } catch (e) { }

  // uuid timestamp amount description sender currency source_type
  DB.run(
    `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    timestamp TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    sender TEXT,
    currency TEXT NOT NULL,
    source_type TEXT,
    FOREIGN KEY (source_type) REFERENCES sources(type)
  )
`,
  );
}

module.exports = { migrate };
