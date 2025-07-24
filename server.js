const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ الاتصال بقاعدة البيانات PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'ضع_رابطك_هنا',
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ✅ إنشاء الجدول إذا لم يكن موجودًا
pool.query(`
  CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT,
    description TEXT
  );
`, (err) => {
  if (err) {
    console.error('❌ Failed to create table:', err);
  } else {
    console.log('✅ Table "games" is ready.');
  }
});

// ✅ الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ جلب كل الألعاب
app.get('/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).send('Error fetching games');
  }
});

// ✅ إضافة لعبة جديدة
app.post('/games', async (req, res) => {
  const { name, image, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO games (name, image, description) VALUES ($1, $2, $3)',
      [name, image, description]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error adding game:', err);
    res.status(500).send('Error adding game');
  }
});

// ✅ تعديل لعبة حسب الفهرس (index)
app.put('/games/:index', async (req, res) => {
  const index = parseInt(req.params.index);
  const { name, image, description } = req.body;

  try {
    const result = await pool.query('SELECT id FROM games ORDER BY id');
    const games = result.rows;

    if (index < 0 || index >= games.length) {
      return res.status(400).send('Invalid game index');
    }

    const id = games[index].id;

    await pool.query(
      'UPDATE games SET name = $1, image = $2, description = $3 WHERE id = $4',
      [name, image, description, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating game:', err);
    res.status(500).send('Error updating game');
  }
});

// ✅ حذف لعبة حسب الفهرس
app.delete('/games/:index', async (req, res) => {
  const index = parseInt(req.params.index);

  try {
    const result = await pool.query('SELECT id FROM games ORDER BY id');
    const games = result.rows;

    if (index < 0 || index >= games.length) {
      return res.status(400).send('Invalid game index');
    }

    const id = games[index].id;

    await pool.query('DELETE FROM games WHERE id = $1', [id]);

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting game:', err);
    res.status(500).send('Error deleting game');
  }
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Dashboard running at http://localhost:${PORT}`);
});
