const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const dbFile = './anubis.db';
const db = new sqlite3.Database(dbFile);

async function init() {
  db.serialize(async () => {
    db.run(`PRAGMA foreign_keys = ON;`);

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

    // كلمة سر افتراضية (admin / admin123) — غيّرها بعد التثبيت
    const username = 'admin';
    const defaultPass = 'admin123';
    const saltRounds = 10;
    const hash = await bcrypt.hash(defaultPass, saltRounds);

    db.get(`SELECT * FROM admins WHERE username = ?`, [username], (err, row) => {
      if (err) return console.error(err);
      if (!row) {
        db.run(`INSERT INTO admins (username, password_hash) VALUES (?, ?)`, [username, hash], function(err2) {
          if (err2) return console.error(err2);
          console.log(`Admin user '${username}' created with default password '${defaultPass}'. Please change it after login.`);
        });
      } else {
        console.log('Admin user already exists.');
      }
    });

    console.log('Database initialized.');
  });
}

init().then(() => {
  db.close();
});
