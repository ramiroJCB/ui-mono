const fixtures = require('./build/applications/aion-subscriber-ui/fixtures');
const routes = require('./routes.json');
const path = require('path');

const pause = require('connect-pause');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(fixtures);
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../../../node_modules/json-server/dist/')
});

server.use(middlewares);
server.use(pause(500));
server.use(jsonServer.rewriter(routes));
server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
