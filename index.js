// try to load express and fail fast with clear instructions if it's missing/corrupt
let express;
try {
	express = require('express');
} catch (err) {
	console.error('ERROR: express is missing or corrupted in node_modules.');
	console.error('Fix locally, commit package.json & package-lock.json, then push.');
	console.error('Run locally:');
	console.error('  rm -rf node_modules');
	console.error('  rm -f package-lock.json');
	console.error('  npm install express@4');
	console.error('  npm install');
	console.error('');
	console.error('Detailed error:', err && err.stack ? err.stack : err);
	process.exit(1);
}

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Serve index.html if present, fallback text otherwise
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'static', 'index.html'), err => {
		if (err) res.type('txt').send('App running but index.html not found.');
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
