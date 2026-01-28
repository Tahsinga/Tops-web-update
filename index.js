const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const CONTENT_FILE = path.join(ROOT_DIR, 'data', 'saved_content.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(ROOT_DIR, 'data'))) {
	fs.mkdirSync(path.join(ROOT_DIR, 'data'), { recursive: true });
}

// Helper to read saved content
function getSavedContent() {
	try {
		if (fs.existsSync(CONTENT_FILE)) {
			return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
		}
	} catch (e) {
		console.error('Error reading saved content:', e);
	}
	return {};
}

// Helper to save content
function saveSavedContent(data) {
	try {
		fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf8');
		return true;
	} catch (e) {
		console.error('Error saving content:', e);
		return false;
	}
}

// Helper to parse request body
function parseBody(req, callback) {
	let body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});
	req.on('end', () => {
		try {
			callback(JSON.parse(body));
		} catch (e) {
			callback(null);
		}
	});
}

const server = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const pathname = parsedUrl.pathname;

	// Enable CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	// Handle OPTIONS requests
	if (req.method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}

	// API: Get saved content (return both flat mapping and `text` for backwards compatibility)
	if (pathname === '/api/content' && req.method === 'GET') {
		const saved = getSavedContent();
		// respond with flat keys and a `text` object for older clients
		const resp = Object.assign({}, saved, { text: saved });
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(resp));
		return;
	}

	// API: Save content text
	if (pathname === '/api/content/text' && req.method === 'POST') {
		parseBody(req, (data) => {
			if (data && data.id && data.content !== undefined) {
				const saved = getSavedContent();
				saved[data.id] = data.content;
				const success = saveSavedContent(saved);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success }));
			} else {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: false, error: 'Invalid data' }));
			}
		});
		return;
	}

	// API: Reset all changes
	if (pathname === '/api/reset' && req.method === 'POST') {
		try {
			if (fs.existsSync(CONTENT_FILE)) {
				fs.unlinkSync(CONTENT_FILE);
			}
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: true }));
		} catch (e) {
			res.writeHead(500, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: false, error: e.message }));
		}
		return;
	}

	// API: Upload file
	if (pathname === '/api/upload' && req.method === 'POST') {
		const uploadDir = path.join(ROOT_DIR, 'static', 'uploads');
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		
		const filename = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const filepath = path.join(uploadDir, filename);
		const stream = fs.createWriteStream(filepath);
		
		req.pipe(stream);
		stream.on('finish', () => {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: true, url: `/static/uploads/${filename}` }));
		});
		stream.on('error', () => {
			res.writeHead(500, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: false }));
		});
		return;
	}

	// Static file serving
	let filePath = path.join(ROOT_DIR, pathname);

	// Prevent directory traversal
	if (!filePath.startsWith(ROOT_DIR)) {
		res.writeHead(403, { 'Content-Type': 'text/plain' });
		res.end('Forbidden');
		return;
	}

	// If requesting root, serve index.html
	if (pathname === '/') {
		filePath = path.join(ROOT_DIR, 'index.html');
	}

	// Check if file exists
	fs.stat(filePath, (err, stats) => {
		if (err || !stats.isFile()) {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('Not found');
			return;
		}

		// Determine content type
		const ext = path.extname(filePath).toLowerCase();
		const contentTypes = {
			'.html': 'text/html; charset=utf-8',
			'.css': 'text/css',
			'.js': 'application/javascript',
			'.json': 'application/json',
			'.png': 'image/png',
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.gif': 'image/gif',
			'.svg': 'image/svg+xml',
			'.webp': 'image/webp',
			'.ico': 'image/x-icon',
			'.woff': 'font/woff',
			'.woff2': 'font/woff2',
			'.ttf': 'font/ttf',
			'.otf': 'font/otf'
		};
		const contentType = contentTypes[ext] || 'application/octet-stream';

		res.writeHead(200, { 'Content-Type': contentType });
		fs.createReadStream(filePath).pipe(res);
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
