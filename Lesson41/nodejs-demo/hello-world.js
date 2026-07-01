const http = require('node:http');

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {
  const randomNumber = Math.floor(Math.random() * 11);

  if (randomNumber % 2 === 0) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found\n');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
