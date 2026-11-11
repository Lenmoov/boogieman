// Tiny static file server for local use and for the tunnel. Usage: node tools/serve.js [port]
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const port = parseInt(process.argv[2] || process.env.PORT || '8321', 10);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg',
  '.webmanifest': 'application/manifest+json', '.md': 'text/plain; charset=utf-8'
};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(root, p));
  if (!file.startsWith(root) || p.startsWith('/.')) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(port, () => console.log('Boogie Woogie Studio: http://localhost:' + port));
