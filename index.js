var winston = require('winston'),
    morgan = require('morgan'),
    fs = require('fs'), 
    http = require('http'),
    httpProxy = require('http-proxy');

var logger = morgan('combined');

// 
// Create a proxy server with custom application logic 
// 
var proxy = httpProxy.createProxyServer({
// HTTPS does not work yet
//  ssl: {
//    key: fs.readFileSync('server.key', 'utf8'),
//    cert: fs.readFileSync('server.crt', 'utf8')
//  }
});

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
 
// 
// Create your custom server and just call `proxy.web()` to proxy 
// a web request to the target passed in the options 
// also you can use `proxy.ws()` to proxy a websockets request 
// 
var server = http.createServer(function(req, res) {
  log(req, res); 

  // You can define here your custom logic to handle the request 
  // and then proxy the request. 
  logger(req, res, function (err) {
    if (err) { winston.error(err); }
    proxy.web(req, res, { target: 'http://m2.exosite.com' });
  });
});
 
console.log("listening on port 5050");
server.listen(5050);
