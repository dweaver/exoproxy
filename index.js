var winston = require('winston'),
    morgan = require('morgan'),
    fs = require('fs'), 
    https = require('https'),
    http = require('http'),
    httpProxy = require('http-proxy');

var logger = morgan('combined');

// 
// Create a proxy server with custom application logic 
// 
var proxy = httpProxy.createProxyServer({});

function log(req, res) {
  var body = '';
  winston.info('request', req.method, req.url);
  winston.info('request', req.headers);

  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    winston.info('request', body);
  });
}
 
 
// SSL Options, Generated as follows:
// openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
var ssl_options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
 
// create https server
var httpsServer = https.createServer(ssl_options, function(req, res) {
  // send https traffic to http server
  proxy.web(req, res, { target: 'http://localhost' });
});

var httpServer = http.createServer( function(req, res) {
  log(req, res); 

  // You can define here your custom logic to handle the request 
  // and then proxy the request. 
  logger(req, res, function (err) {
    if (err) { winston.error(err); }
    proxy.web(req, res, { target: 'http://m2.exosite.com' });
  });
});
 
console.log("Listening for ssl traffic on port 443 and non-ssl on port 80");
httpsServer.listen(443);
httpServer.listen(80);
