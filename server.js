const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const DB_FILE = path.join(__dirname, "anubis.db");
const db = new sqlite3.Database(DB_FILE);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}
function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}
function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

// ================== API ==================

// عرض الدول
app.get("/api/countries", async (req, res) => {
  try {
    const rows = await allAsync(
      "SELECT DISTINCT country FROM sellers ORDER BY country COLLATE NOCASE"
    );
    res.json(rows.map((r) => r.country));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// عرض البائعين حسب الدولة
app.get("/api/sellers/:country", async (req, res) => {
  try {
    const rows = await allAsync("SELECT * FROM sellers WHERE country = ?", [
      req.params.country,
    ]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// عرض كل البائعين (لوحة التحكم)
app.get("/api/sellers", async (req, res) => {
  try {
    const rows = await allAsync("SELECT * FROM sellers ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// إضافة بائع
app.post("/api/seller", async (req, res) => {
  try {
    const { country, name, desc, telegram, whatsapp, verified } = req.body;
    if (!country || !name)
      return res.status(400).json({ error: "Missing fields" });
    const r = await runAsync(
      "INSERT INTO sellers (country, name, desc, telegram, whatsapp, verified) VALUES (?,?,?,?,?,?)",
      [country, name, desc, telegram, whatsapp, verified ? 1 : 0]
    );
    res.json({ success: true, id: r.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// حذف بائع
app.delete("/api/seller/:id", async (req, res) => {
  try {
    await runAsync("DELETE FROM sellers WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// تقديم شكوى / تقييم
app.post("/api/seller/:id/complaint", async (req, res) => {
  try {
    await runAsync("UPDATE sellers SET complaints = complaints + 1 WHERE id=?", [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/seller/:id/rate", async (req, res) => {
  try {
    const rate = parseInt(req.body.rate) || 0;
    await runAsync(
      "UPDATE sellers SET rates = rates + 1, total = total + ? WHERE id=?",
      [rate, req.params.id]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== المنتجات =====
app.get("/api/products", async (req, res) => {
  try {
    const rows = await allAsync("SELECT * FROM products ORDER BY created_at DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/api/product", async (req, res) => {
  try {
    const { name, price, details, image } = req.body;
    if (!name || !price)
      return res.status(400).json({ error: "Missing product data" });
    const r = await runAsync(
      "INSERT INTO products (name, price, details, image) VALUES (?,?,?,?)",
      [name, price, details, image]
    );
    res.json({ success: true, id: r.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.delete("/api/product/:id", async (req, res) => {
  try {
    await runAsync("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== تسجيل دخول الأدمن =====
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Missing credentials" });

    const admin = await getAsync("SELECT * FROM admins WHERE username = ?", [
      username,
    ]);
    if (!admin) return res.status(401).json({ error: "Invalid username" });

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ error: "Wrong password" });

    res.json({ success: true, token: "admintoken" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// صفحة الموقع
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ ANUBIS server running on http://localhost:${PORT}`)
);
