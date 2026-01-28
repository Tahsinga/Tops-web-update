const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Serve index.html if present
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'), err => {
    if (err) res.type('txt').send('Hello from Tops Systems 🚀');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
