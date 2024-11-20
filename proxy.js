const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const https = require('https');
const fs = require('fs');

const key = fs.readFileSync('./certs/key_decrypted.pem');
const cert = fs.readFileSync('./certs/certificate.pem');

const options = {
  target: 'https://localhost:8080',
  cookieDomainRewrite: 'dev-pedidos.com',
  changeOrigin: true,
  logLevel: 'debug',
  secure: false,
  onProxyReq: function (proxyReq, req, res) {
    if (!req.headers['accept-language']) {
      proxyReq.setHeader('Accept-Language', 'es-ES,es;q=0.9,en;q=0.8');
    } else {
      proxyReq.setHeader('Accept-Language', req.headers['accept-language']);
    }
  }
};

app.use('/api', createProxyMiddleware(options));

options.target = 'https://localhost:5170';
app.use('/admin/login', createProxyMiddleware(options));

options.target = 'https://localhost:5180';
app.use('/auth', createProxyMiddleware(options));

options.target = 'https://localhost:5171';
app.use('/admin', createProxyMiddleware(options));

options.target = 'https://localhost:5176';
app.use('/cliente/login', createProxyMiddleware(options));

options.target = 'https://localhost:5177';
app.use('/cliente', createProxyMiddleware(options));


https.createServer({ key, cert }, app).listen(443, '0.0.0.0', () => {
  console.log('Servidor HTTPS proxy escuchando en https://dev-pedidos.com');
});
