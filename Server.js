const http = require('http');
const server = http.createServer((req, res) => {
    //console.log(req);
    //process.exit();
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Hi</title></head>');
    res.write('<body><h1>Hello World</h1></body>');
    res.write('</html>');
    res.end();
});
server.listen(3000);