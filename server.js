const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ المسار الكامل لملف الألعاب
const dataPath = path.join(__dirname, 'DATA', 'games.json');

// ✅ إعدادات Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ✅ الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ جلب جميع الألعاب (Dashboard يستخدمه)
app.get('/games', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading games.json:', err);
      return res.status(500).send('Error reading games file');
    }
    res.json(JSON.parse(data));
  });
});

// ✅ إضافة لعبة جديدة (Dashboard يستخدمه)
app.post('/games', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read file' });

    const games = JSON.parse(data);
    games.push(req.body); // ← أضف اللعبة الجديدة

    fs.writeFile(dataPath, JSON.stringify(games, null, 2), 'utf8', err => {
      if (err) return res.status(500).json({ error: 'Failed to write file' });
      res.json({ success: true });
    });
  });
});

// ✅ تعديل لعبة موجودة (Dashboard يستخدمه)
app.put('/games/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { name, image, description } = req.body;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');

    const games = JSON.parse(data);
    if (!games[index]) return res.status(404).send('Game not found');

    games[index] = { name, image, description };

    fs.writeFile(dataPath, JSON.stringify(games, null, 2), err => {
      if (err) return res.status(500).send('Error writing file');
      res.json({ success: true });
    });
  });
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Dashboard running at http://localhost:${PORT}`);
});
