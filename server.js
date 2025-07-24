const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const dataPath = path.join(__dirname, 'DATA', 'games.json');

app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// 🟡 جلب كل الألعاب
app.get('/games', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading games file');
    res.json(JSON.parse(data));
  });
});

// 🟠 تعديل لعبة محددة
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

// ✅ مسار لإضافة لعبة جديدة
app.post('/games', (req, res) => {
  const { name, image, description } = req.body;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');

    const games = JSON.parse(data);
    games.push({ name, image, description });

    fs.writeFile(dataPath, JSON.stringify(games, null, 2), err => {
      if (err) return res.status(500).send('Error writing file');
      res.json({ success: true });
    });
  });
});

// 🟢 تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/dashboard.html`);
});
