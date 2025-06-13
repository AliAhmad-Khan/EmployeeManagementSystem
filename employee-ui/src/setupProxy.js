const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:7009',  // ← use your HTTPS port
      secure: false,                      // allow self-signed cert
      changeOrigin: true,
    })
  );
};
