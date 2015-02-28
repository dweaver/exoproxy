# Proxy Server
Proxies both http and https requests to m2.exosite.com.  https requests to Exosite
are proxied via http.

Performs basic logging of all requests.


```
$ npm install
$ node index.js
```

#Generating self signed certificates
Generate self signed certificates with the following:

    openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
