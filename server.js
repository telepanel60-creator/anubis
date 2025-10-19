const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const DB_FILE = path.join(__dirname, 'anubis.db');
const db = new sqlite3.Database(DB_FILE);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ------------ Helpers ------------
function runAsync(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}
function allAsync(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
  });
}
function getAsync(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
  });
}

// ------------ Public API for front-end ------------

// Get list of countries (derived from sellers)
app.get('/api/countries', async (req, res) => {
  try {
    const rows = await allAsync(`SELECT DISTINCT country FROM sellers ORDER BY country COLLATE NOCASE`);
    res.json(rows.map(r => r.country));
  } catch (e) { res.status(500).json({error: e.message}); }
});

// Get sellers by country
app.get('/api/sellers/:country', async (req, res) => {
  try {
    const country = req.params.country;
    const rows = await allAsync(`SELECT * FROM sellers WHERE country = ?`, [country]);
    res.json(rows);
  } catch (e) { res.status(500).json({error: e.message}); }
});

// Get all sellers (for admin)
app.get('/api/sellers', async (req, res) => {
  try {
    const rows = await allAsync(`SELECT * FROM sellers ORDER BY id DESC`);
    res.json(rows);
  } catch (e) { res.status(500).json({error: e.message}); }
});

// Add seller (admin protected)
app.post('/api/seller', async (req, res) => {
  try {
    const { country, name, desc, telegram, whatsapp, verified } = req.body;
    const r = await runAsync(
      `INSERT INTO sellers (country, name, desc, telegram, whatsapp, verified) VALUES (?,?,?,?,?,?)`,
      [country, name, desc, telegram, whatsapp, verified ? 1 : 0]
    );
    res.json({ success: true, id: r.id });
  } catch (e) { res.status(500).json({error: e.message}); }
});

// Edit seller
app.put('/api/seller/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { country, name, desc, telegram, whatsapp, verified } = req.body;
    const r = await runAsync(
      `UPDATE sellers SET country=?, name=?, desc=?, telegram=?, whatsapp=?, verified=? WHERE id=?`,
      [country, name, desc, telegram, whatsapp, verified ? 1 : 0, id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({error: e.message}); }
});

// Delete seller
app.delete('/api/seller/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await runAsync(`DELETE FROM sellers WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({error: e.message}); }
});

// Complaints / rating endpoints (simple increments)
app.post('/api/seller/:id/complaint', async (req, res) => {
  try {
    const id = req.params.id;
    await runAsync(`UPDATE sellers SET complaints = complaints + 1 WHERE id=?`, [id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({error: e.message}); }
});

app.post('/api/seller/:id/rate', async (req, res) => {
  try {
    const id = req.params.id;
    const { rate } = req.body; // integer 1..5
    await runAsync(`UPDATE sellers SET rates = rates + 1, total = total + ? WHERE id = ?`, [rate, id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({error: e.message}); }
});

// ----------- Products API -----------
app.get('/api/products', async (req, res) => {
  try {
    const rows = await allAsync(`SELECT * FROM products ORDER BY created_at DESC`);
    res.json(rows);
  } catch (e) { res.status(500).json({error: e.message}); }
});

app.post('/api/product', async (req, res) => {
  try {
    const { name, price, details, image } = req.body;
    const r = await runAsync(`INSERT INTO products (name, price, details, image) VALUES (?,?,?,?)`, [name, price, details, image]);
    res.json({ success: true, id: r.id });
  } catch (e) { res.status(500).json({error: e.message}); }
});

app.put('/api/product/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, details, image } = req.body;
    await runAsync(`UPDATE products SET name=?, price=?, details=?, image=? WHERE id=?`, [name, price, details, image, id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({error: e.message}); }
});

app.delete('/api/product/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await runAsync(`DELETE FROM products WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({error: e.message}); }
});

// --------- Admin login (simple) ----------
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const row = await getAsync(`SELECT * FROM admins WHERE username = ?`, [username]);
    if (!row) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    // For simplicity, return a basic token (in prod use JWT)
    res.json({ success: true, token: 'admintokendo-not-secure' });
  } catch (e) { res.status(500).json({error: e.message}); }
});

// Serve index.html for client-side routes fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ANUBIS server running on http://localhost:${PORT}`);
});
