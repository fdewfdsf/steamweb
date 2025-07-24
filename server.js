const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const dataPath = path.join(__dirname, 'DATA', 'games.json');

// ✅ الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ قراءة الألعاب
app.get('/games', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading games file');
    res.json(JSON.parse(data));
  });
});

// ✅ تعديل لعبة حسب index
app.put('/games/:index', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    let games = JSON.parse(data);
    const index = parseInt(req.params.index);
    if (index >= 0 && index < games.length) {
      games[index] = req.body;
      fs.writeFile(dataPath, JSON.stringify(games, null, 2), 'utf8', err => {
        if (err) return res.status(500).send('Error writing file');
        res.json({ success: true });
      });
    } else {
      res.status(400).send('Invalid game index');
    }
  });
});

// ✅ إضافة لعبة جديدة
app.post('/games', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    let games = JSON.parse(data);
    games.push(req.body);
    fs.writeFile(dataPath, JSON.stringify(games, null, 2), 'utf8', err => {
      if (err) return res.status(500).send('Error writing file');
      res.json({ success: true });
    });
  });
});

// ✅ حذف لعبة حسب index
app.delete('/games/:index', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    let games = JSON.parse(data);
    const index = parseInt(req.params.index);
    if (index >= 0 && index < games.length) {
      games.splice(index, 1);
      fs.writeFile(dataPath, JSON.stringify(games, null, 2), 'utf8', err => {
        if (err) return res.status(500).send('Error writing file');
        res.json({ success: true });
      });
    } else {
      res.status(400).send('Invalid game index');
    }
  });
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Dashboard running at http://localhost:${PORT}`);
});
