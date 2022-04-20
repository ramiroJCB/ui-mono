const fixtures = require('./build/applications/aion-classes-ui/fixtures');
const routes = require('./routes.json');
const bodyParser = require('body-parser');
const path = require('path');
const pause = require('connect-pause');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(fixtures);

const { reservations, trainingClasses, userInfo } = fixtures;

const pluralODataPaths = ['/classReservationAggregates', '/reservations', '/trainingClasses'];

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

const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../../../node_modules/json-server/dist/')
});

server.use(middlewares);
server.use(bodyParser.json());
server.use(pause(500));

server.route('/api/v3.00/classes').get((req, res) => {
  const { $filter } = req.query;
  const splitFilter = $filter.split(' ');

  if ($filter.startsWith('id eq') && splitFilter.length === 3) {
    const classId = $filter.split(' ')[2];
    const trainingClass = trainingClasses.filter(({ id }) => id === classId);
    res.json({
      '@odata.count': 1,
      value: trainingClass
    });
  } else {
    res.json({
      '@odata.count': trainingClasses.length,
      value: trainingClasses
    });
  }
});

server.route('/api/v3.00/reservations').get((req, res) => {
  const { $filter } = req.query;
  const splitFilter = $filter.split(' ');

  if ($filter.includes('classId eq')) {
    const classIdIndex = splitFilter.indexOf('classId');
    if (classIdIndex > -1) {
      const trainingClassId = splitFilter[classIdIndex + 2];
      const results = reservations.filter(({ classId }) => classId === trainingClassId);
      res.json({
        '@odata.count': results.length,
        value: results
      });
    }
  } else if ($filter.startsWith('id eq') && splitFilter.length === 3) {
    const reservationId = $filter.split(' ')[2];
    const reservation = reservations.filter(({ id }) => id === reservationId);
    res.json({
      '@odata.count': 1,
      value: reservation
    });
  } else {
    res.json({
      '@odata.count': reservations.length,
      value: reservations
    });
  }
});

const user = {
  userId: userInfo.userId,
  userName: userInfo.userName,
  fullName: userInfo.fullName
};

server.use(jsonServer.bodyParser);
server.use((req, _res, next) => {
  if (req.method === 'POST') {
    const now = new Date();
    req.body.createdDateUtc = now.toISOString();
    req.body.createdBy = user;
    req.body.updatedDateUtc = null;
    req.body.updatedBy = null;
  }
  if (req.method === 'PUT') {
    const now = new Date();
    req.body.updatedDateUtc = now.toISOString();
    req.body.updatedBy = user;
  }
  next();
});

server.use(jsonServer.rewriter(routes));
server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
