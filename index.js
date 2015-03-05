var winston = require('winston'),
    fs = require('fs'), 
    https = require('https'),
    http = require('http'),
    httpProxy = require('http-proxy');

    

// 
// Create a proxy server with custom application logic 
// 
var proxyLocal = httpProxy.createProxyServer({});
var proxyM2 = httpProxy.createProxyServer({});

// setup logger
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
        colorize: true
    })
  ]}
);

function log(req, res) {
  var body = '';
  logger.info('*************** request starting ****************');
  logger.info('Requesting IP: ', req.connection.remoteAddress);
  logger.info('Method/url: ', req.method, req.url);
  logger.info('Headers:    ', JSON.stringify(req.headers, true, 2));

  req.on('data', function (chunk) {
    body += chunk;
  });

  req.on('end', function () {
    logger.info('Body:       ', body);
    logger.info('************** request ending *************');
  });
  
  res.oldWrite = res.write;
  res.write = function(data) {
    logger.info('Response Body:\r\n',data.toString('UTF8'));
    res.oldWrite(data);
  }
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
  proxyLocal.web(req, res, { target: 'http://localhost' });
});

var httpServer = http.createServer( function(req, res) {
  log(req, res); 
  proxyM2.web(req, res, { target: 'http://m2.exosite.com' });
});

proxyM2.on('proxyRes', function (proxyRes, req, res) {
    logger.info('Response code:     ', proxyRes.statusCode);
    logger.info('Response headers:  ', proxyRes.headers);
  });


 
console.log("Listening for ssl traffic on port 443 and non-ssl on port 80");
httpsServer.listen(443);
httpServer.listen(80);
