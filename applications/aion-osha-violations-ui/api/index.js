const fixtures = require('./build/applications/aion-osha-violations-ui/fixtures');
const routes = require('./routes.json');
const path = require('path');

const pause = require('connect-pause');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(fixtures);

const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../../../node_modules/json-server/dist/')
});

const pluralODataPaths = ['/notMatched', '/matchedViolations'];

router.render = (req, res) => {
  const { path, method } = req;
  const { data } = res.locals;

  const body =
    pluralODataPaths.includes(path) && method === 'GET'
      ? {
          '@odata.count': fixtures[path.slice(1)].length,
          value: data
        }
      : data;

  res.json(body);
};

server.use(middlewares);
server.use(pause(500));

server.use((req, _res, next) => {
  const { $top, $orderby, $skip, $filter } = req.query;

  const jsonServerQuery = {
    _limit: $top,
    _sort: $orderby,
    _page: $skip && $top ? $skip / $top + 1 : undefined
  };

  if ($filter) {
    const [, key, value] = $filter.match(/Equals\(tolower\((\w+)\),'([^']+)'\)/) || [];
    if (key && value) {
      jsonServerQuery[`${key}_like`] = value;
    }
  }

  req.query = {
    ...req.query,
    ...jsonServerQuery
  };
  next();
});

server.use(jsonServer.rewriter(routes));
server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
