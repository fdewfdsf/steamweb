const express = require('express');
const fs = require('fs');
const path = require('path'); // ✅ مهم

const app = express();
const PORT = process.env.PORT || 3000; // ✅ مهم لـ Heroku

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ✅ الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ قراءة الألعاب
app.get('/games', (req, res) => {
  fs.readFile(path.join(__dirname, 'DATA', 'games.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading games file');
    res.json(JSON.parse(data));
  });
});


// ✅ حفظ التعديلات
app.post('/api/games', (req, res) => {
  fs.writeFile('games.json', JSON.stringify(req.body, null, 2), 'utf8', err => {
    if (err) return res.status(500).json({ error: 'Failed to write file' });
    res.json({ success: true });
  });
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Dashboard running at http://localhost:${PORT}`);
});
