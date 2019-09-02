const http = require('http');
const server = http.createServer((req, res) => {
    const url = req.url;
    if(url === '/'){
        res.write('<html><head><title>Message</title></head><body><form action="/message" method="POST"><textarea rows=5 cols=10></textarea><button type="submit">Send</button></form></body></html>')
        return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Hi</title></head>');
    res.write('<body><h1>Hello World</h1></body>');
    res.write('</html>');
    res.end();
});
server.listen(3000);