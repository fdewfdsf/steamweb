const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // ملفات HTML و CSS داخل مجلد public
app.use(express.json());

// قراءة الألعاب
app.get('/api/games', (req, res) => {
  fs.readFile('games.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read file' });
    res.json(JSON.parse(data));
  });
});

// حفظ التعديلات
app.post('/api/games', (req, res) => {
  fs.writeFile('games.json', JSON.stringify(req.body, null, 2), 'utf8', err => {
    if (err) return res.status(500).json({ error: 'Failed to write file' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Dashboard running at http://localhost:${PORT}`);
});
