const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const dbFile = './anubis.db';
const db = new sqlite3.Database(dbFile);

(async () => {
  db.serialize(async () => {
    db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS sellers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT,
      name TEXT,
      desc TEXT,
      telegram TEXT,
      whatsapp TEXT,
      verified INTEGER DEFAULT 0,
      rates INTEGER DEFAULT 0,
      total INTEGER DEFAULT 0,
      complaints INTEGER DEFAULT 0
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price TEXT,
      details TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);

    const username = 'admin';
    const pass = 'admin123';
    const hash = await bcrypt.hash(pass, 10);

    db.get(`SELECT * FROM admins WHERE username=?`, [username], (err, row) => {
      if (!row) {
        db.run(`INSERT INTO admins (username, password_hash) VALUES (?, ?)`, [username, hash]);
        console.log("✅ Created default admin (admin/admin123)");
      } else {
        console.log("Admin exists, skipped.");
      }
    });
  });
})();
