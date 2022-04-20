const fixtures = require('./build/applications/aion-connect-ui/fixtures');
const routes = require('./routes.json');
const path = require('path');
const pause = require('connect-pause');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(fixtures);

const {
  organizations,
  projects,
  licenses,
  accreditations,
  certifications,
  references,
  contactInformation,
  logo,
  officeLocations,
  announcements,
  tradeNames,
  searchResults,
  searchFilters
} = fixtures;

const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../../../node_modules/json-server/dist/')
});

server.use(middlewares);
server.use(pause(500));

server.route('/api/v2/organizations\\(:organizationId\\)').patch(({ params: { organizationId }, body }, res) => {
  const index = organizations.value.findIndex(({ id }) => id === organizationId);

  if (index > -1) {
    const organization = organizations.value[index];

    organization.value = body[0].value;
    res.json(organization);
  } else {
    res.sendStatus(404);
  }
});

server.route('files/api/v3.01/organizations\\(:organizationId\\)/logo').get((req, res) => res.json({ value: logo }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/contactInformation')
  .get((req, res) => res.json({ value: contactInformation }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/projects')
  .get((req, res) => res.json({ '@odata.count': projects.length, value: projects }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/licenses')
  .get((req, res) => res.json({ '@odata.count': licenses.length, value: licenses }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/certifications')
  .get((req, res) => res.json({ '@odata.count': certifications.length, value: certifications }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/accreditations')
  .get((req, res) => res.json({ '@odata.count': accreditations.length, value: accreditations }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/references')
  .get((req, res) => res.json({ '@odata.count': references.length, value: references }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/officeLocations')
  .get((req, res) => res.json({ '@odata.count': officeLocations.length, value: officeLocations }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/announcements')
  .get((req, res) => res.json({ '@odata.count': announcements.length, value: announcements }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/tradeNames')
  .get((req, res) => res.json({ '@odata.count': tradeNames.length, value: tradeNames }));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/images')
  .get((req, res) => res.json({ '@odata.count': 0, value: [] }));

server
  .route('/files/v3.01/organizations\\(:organizationId\\)/logo')
  .get((req, res) => res.redirect('https://picsum.photos/600/600'));

server.route('/api/v3.01/organizations/contractorSearchFilters*').get((req, res) => res.json(searchFilters));

server
  .route('/api/v3.01/organizations/contractorSearch*')
  .get((req, res) => res.json({ '@odata.count': searchResults.length, value: searchResults }));

server.use(jsonServer.rewriter(routes));
server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
