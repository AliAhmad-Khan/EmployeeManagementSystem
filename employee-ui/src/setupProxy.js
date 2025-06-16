const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5119',  // Updated to match the actual backend URL
      secure: false,                      // allow self-signed cert
      changeOrigin: true,
    })
  );
};
