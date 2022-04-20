const fixtures = require('./build/applications/aion-form-builder-ui/fixtures');
const routes = require('./routes.json');
const bodyParser = require('body-parser');
const path = require('path');
const pause = require('connect-pause');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(fixtures);
const faker = require('faker');

const { userInfo } = fixtures;

const pluralODataPaths = ['/forms', '/formSections', '/formElements'];

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

const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../../../node_modules/json-server/dist/')
});

server.use(middlewares);
server.use(bodyParser.json());
server.use(pause(500));

server.use(jsonServer.bodyParser);

server.route('/api/v3.01/forms').post((req, res) => {
  const requestBody = req.body;
  const now = new Date();

  res.status(201).json({
    ...requestBody,
    id: faker.random.uuid(),
    organizationName: 'Local Organization',
    status: 'Draft',
    createdDateUtc: now.toISOString(),
    createdByUserId: userInfo.userId,
    createdByUserFirstName: 'Jason',
    createdByUserLastName: 'Script',
    updatedDateUtc: null,
    updatedByUserId: null,
    updatedByUserFirstName: null,
    updatedByUserLastName: null,
    attachmentsMetadata: [],
    embeddedAttachmentsMetadata: []
  });
});

server.use(jsonServer.rewriter(routes));
server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
