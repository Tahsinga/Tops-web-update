const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve your existing static files (css, images, etc.)
app.use('/static', express.static(path.join(__dirname, 'static')));

// Serve a simple index page (falls back to a text response if file missing)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'), err => {
    if (err) res.send('Hello from Render 🚀');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
