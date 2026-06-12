const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use('/api',   createProxyMiddleware({ target: 'http://localhost:8080', changeOrigin: true }));
    app.use('/music', createProxyMiddleware({ target: 'http://localhost:8080', changeOrigin: true }));
    app.use('/board-files', createProxyMiddleware({ target: 'http://localhost:8080', changeOrigin: true }));
    app.use('/ws',    createProxyMiddleware({ target: 'ws://localhost:8080', changeOrigin: true, ws: true }));
};