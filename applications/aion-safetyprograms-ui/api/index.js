const fixtures = require('./build/applications/aion-safetyprograms-ui/fixtures');
const routes = require('./routes.json');
const path = require('path');
const formidable = require('formidable');
const faker = require('faker');

const pause = require('connect-pause');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(fixtures);
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../../../node_modules/json-server/dist/')
});

server.get('/files/v1/safetyProgramDocuments*', (_req, res) => {
  res.sendFile('/tmp/E7B48v1.0.pdf');
});

server.post('/files/v1/safetyProgramDocuments', (req, res, next) => {
  const form = formidable();

  form.parse(req, (err, _fields, files) => {
    if (err) {
      next(err);
      return;
    }

    const { size, name, type, mtime } = files.File;
    res.json({
      id: faker.random.uuid(),
      organizationId: '0b7319a1-4571-4940-aabd-5b4d42bc086f',
      mimeType: type,
      fileName: name,
      fileSize: size,
      createdDateUtc: mtime
    });
  });
});

const pluralODataPaths = [
  '/safetyProgramBusinessUnits',
  '/safetyProgramClients',
  '/safetyProgramClientServiceRegions',
  '/safetyProgramComments',
  '/safetyProgramContractors',
  '/safetyProgramDocumentMetadata',
  '/safetyProgramDocumentReferences',
  '/safetyProgramMandates',
  '/safetyProgramRegionalServices',
  '/safetyProgramRequirements',
  '/safetyPrograms'
];

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
server.use(jsonServer.rewriter(routes));

server.use((req, _res, next) => {
  const { $top = 100, $orderby, $skip, $filter } = req.query;
  const jsonServerQuery = {
    _limit: $top,
    _sort: $orderby,
    _page: $skip && $top ? $skip / $top + 1 : undefined
  };

  if ($filter) {
    const [, key, value] = $filter.match(/contains\(tolower\((\w+)\),'([^']+)'\)/) || [];
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

server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
