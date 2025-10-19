const http = require('http');
const fs = require('fs');
const path = require('path');
let port = parseInt(process.env.PORT || '8080', 10);

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? '/index.html' : req.url);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    return res.end('Not found');
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

function startServer(p, attemptsLeft = 5) {
  const s = server.listen(p, () => console.log(`Frontend static server running on http://127.0.0.1:${p}`));
  s.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.warn(`Port ${p} in use, trying ${p + 1}...`);
      // try next port
      startServer(p + 1, attemptsLeft - 1);
    } else {
      console.error('Failed to start frontend server:', err);
      process.exit(1);
    }
  });
}

startServer(port);
