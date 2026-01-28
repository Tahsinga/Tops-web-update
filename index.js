const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const server = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url, true);
	let filePath = path.join(ROOT_DIR, parsedUrl.pathname);

	// Prevent directory traversal
	if (!filePath.startsWith(ROOT_DIR)) {
		res.writeHead(403, { 'Content-Type': 'text/plain' });
		res.end('Forbidden');
		return;
	}

	// If requesting root, serve index.html
	if (parsedUrl.pathname === '/') {
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
