var http = require('http');
 
var options = {
    hostname: '127.0.0.1',
    port: '3000',
    path: '/test',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
        'Content-Encoding': 'identity'
    }
};
 
var client = http.request(options, (res) => {
    res.pipe(process.stdout);
});
 
client.end('客户端请求发送到服务器端的信息');