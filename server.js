const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
fs.ensureDirSync(dataDir);

// Storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'static', 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Routes

// Get all content
app.get('/api/content', (req, res) => {
  try {
    const contentFile = path.join(dataDir, 'content.json');
    if (fs.existsSync(contentFile)) {
      const content = fs.readFileSync(contentFile, 'utf8');
      res.json(JSON.parse(content));
    } else {
      res.json({ text: {}, images: {} });
    }
  } catch (error) {
    console.error('Error reading content:', error);
    res.status(500).json({ error: 'Failed to read content' });
  }
});

// Save text content
app.post('/api/content/text', (req, res) => {
  try {
    const { id, content } = req.body;
    const contentFile = path.join(dataDir, 'content.json');

    let data = { text: {}, images: {} };
    if (fs.existsSync(contentFile)) {
      data = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
    }

    data.text[id] = content;
    fs.writeFileSync(contentFile, JSON.stringify(data, null, 2));

    console.log(`Saved text content for ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving text content:', error);
    res.status(500).json({ error: 'Failed to save text content' });
  }
});

// Save image content
app.post('/api/content/image', (req, res) => {
  try {
    const { id, imageData } = req.body;
    const contentFile = path.join(dataDir, 'content.json');

    let data = { text: {}, images: {} };
    if (fs.existsSync(contentFile)) {
      data = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
    }

    data.images[id] = imageData;
    fs.writeFileSync(contentFile, JSON.stringify(data, null, 2));

    console.log(`Saved image content for ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving image content:', error);
    res.status(500).json({ error: 'Failed to save image content' });
  }
});

// Upload image file
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/static/uploads/${req.file.filename}`;
    console.log(`Uploaded image: ${imageUrl}`);
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Reset all content
app.post('/api/reset', (req, res) => {
  try {
    const contentFile = path.join(dataDir, 'content.json');
    const uploadDir = path.join(__dirname, 'static', 'uploads');

    // Clear content data
    fs.writeFileSync(contentFile, JSON.stringify({ text: {}, images: {} }, null, 2));

    // Clear uploaded images
    if (fs.existsSync(uploadDir)) {
      fs.emptyDirSync(uploadDir);
    }

    console.log('All content reset');
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting content:', error);
    res.status(500).json({ error: 'Failed to reset content' });
  }
});

app.listen(PORT, () => {
  console.log(`Tops Systems CMS server running on port ${PORT}`);
  console.log(`Access your website at: http://localhost:${PORT}`);
});