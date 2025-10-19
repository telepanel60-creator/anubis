// add_admin.js
// يضيف أو يحدث مستخدم أدمن في قاعدة بيانات SQLite (anubis.db)
// الاستخدام: node add_admin.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const DB_FILE = path.join(__dirname, 'anubis.db');

// -- عدّل هنا إذا أردت بيانات مختلفة --
const NEW_USERNAME = 'anubis1235';
const NEW_PASSWORD = 'hggf45g4hgf1bfgh45fghf1hfbf4hfbf1bfb';
// ------------------------------------------------

(async () => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(NEW_PASSWORD, saltRounds);

    const db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error('فشل فتح قاعدة البيانات:', err.message);
        process.exit(1);
      }
    });

    // تحقق إذا المستخدم موجود — لو موجود يحدث الباس هاش، لو مش موجود يضيفه
    db.get('SELECT * FROM admins WHERE username = ?', [NEW_USERNAME], (err, row) => {
      if (err) {
        console.error('خطأ في الاستعلام:', err.message);
        db.close();
        process.exit(1);
      }

      if (row) {
        db.run('UPDATE admins SET password_hash = ? WHERE username = ?', [hash, NEW_USERNAME], function(updateErr) {
          if (updateErr) console.error('خطأ أثناء التحديث:', updateErr.message);
          else console.log(`تم تحديث كلمة مرور الأدمن '${NEW_USERNAME}' بنجاح.`);
          db.close();
        });
      } else {
        db.run('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [NEW_USERNAME, hash], function(insertErr) {
          if (insertErr) console.error('خطأ أثناء الإدراج:', insertErr.message);
          else console.log(`تم إنشاء مستخدم أدمن جديد '${NEW_USERNAME}'.`);
          db.close();
        });
      }
    });

  } catch (e) {
    console.error('خطأ غير متوقع:', e);
    process.exit(1);
  }
})();
