require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// JSON parsing middleware
app.use(express.json());

// This is a custom logging middleware
app.use((req, res, next) => {
  console.log(`${new Date()} ${req.method} ${req.url}`);
  next();
});

// Static files (index: false so our GET / route handles "/")
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST /user
app.post('/user', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  res.type('text').send(`Hello, ${name}!`);
});

// GET /user/:id
app.get('/user/:id', (req, res) => {
  res.type('text').send(`User ${req.params.id} profile`);
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (also catches malformed JSON)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));