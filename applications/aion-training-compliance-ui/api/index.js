const fixtures = require('./build/applications/aion-training-compliance-ui/fixtures');
const routes = require('./routes.json');
const path = require('path');
const { Readable } = require('stream');

const pause = require('connect-pause');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(fixtures);
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../../../node_modules/json-server/dist/')
});

const pluralODataPaths = ['/assignedEmployeeReport'];

router.render = (req, res) => {
  const { path, method } = req;
  const { data } = res.locals;

  const body =
    pluralODataPaths.includes(path) && method === 'GET'
      ? {
          '@odata.count': data.length,
          value: data
        }
      : data;

  res.json(body);
};

server.route('/api/v3.01/downloadReport').get((_, res) => {
  Readable.from('this is a file from json-server').pipe(res);
});

server.use(middlewares);
server.use(pause(500));
server.use(jsonServer.rewriter(routes));
server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
