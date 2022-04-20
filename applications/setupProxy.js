const proxy = require('http-proxy-middleware');

const options = {
  target: process.env.PROXY || 'http://localhost:4000',
  changeOrigin: true
};

module.exports = app => {
  app.use(proxy('/spapi', options));
  app.use(proxy('/api', options));
  app.use(proxy('/SSQV4', options));
  app.use(proxy('/files', options));
};
