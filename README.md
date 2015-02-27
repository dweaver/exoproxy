# Proxy Server

Currently this only supports HTTP->HTTP proxying, and does not even log requests and responses. HTTPS and logging are in progress.

```
$ npm install
$ node index.js
```

Follow the instructions [here](https://devcenter.heroku.com/articles/ssl-certificate-self) for creating a self-signed certificate. After following these instructions you'll have a server.key and server.crt file. Place these in the root and call them  

```
server.key
server.crt
```
