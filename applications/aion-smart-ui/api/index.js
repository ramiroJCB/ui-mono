const fixtures = require('./build/applications/aion-smart-ui/fixtures');
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
server.use(middlewares);
server.use(pause(500));

const { contacts, sites, siteTags, workers } = fixtures;

server.route('/api/v2/organizations\\(:organizationId\\)/sites\\(:siteId\\)/contacts').get((req, res) => {
  res.json({
    value: contacts.filter(({ siteId }) => siteId === req.params.siteId)
  });
});

server.route('/api/v2/organizations\\(:organizationId\\)/sites\\(:siteId\\)/workers').get((req, res) => {
  const { $filter } = req.query;
  if ($filter === "status eq 'CheckedIn'") {
    res.json({
      value: workers.filter(
        ({ siteId, status, livesOnSite }) => siteId === req.params.siteId && (status === 'CheckedIn' || livesOnSite)
      )
    });
  } else {
    const employeeId = $filter.split(' ')[2];
    res.json({
      value: workers.filter(w => w.employeeId === employeeId)
    });
  }
});

server.route('/api/v2/organizations\\(:organizationId\\)/sites').get((req, res) => {
  res.json({
    value: sites.filter(({ organizationId }) => organizationId === req.params.organizationId)
  });
});

server.route('/api/v2/organizations\\(:organizationId\\)/tags').get((req, res) => {
  res.json({
    value: siteTags.filter(({ organizationId }) => organizationId === req.params.organizationId)
  });
});

server.route('/api/v3.01/downloadReport').get((_, res) => {
  Readable.from('this is a file from json-server').pipe(res);
});

server.use(jsonServer.rewriter(routes));
server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
