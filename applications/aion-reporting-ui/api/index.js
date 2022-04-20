const fixtures = require('./build/applications/aion-reporting-ui/fixtures');
const faker = require('faker');
const routes = require('./routes.json');
const bodyParser = require('body-parser');
const pause = require('connect-pause');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(fixtures);
const { odataFilterParser } = require('./helpers');
const { toArray } = require('../../../packages/aion-ui-core/build/helpers/querystring');
const path = require('path');

const {
  contractorPeriods,
  incidentCategories,
  incidentRootCauses,
  incidentTypes,
  operationalMetricValues,
  regionalMetricValues,
  regionalChangeLog
} = fixtures;

const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../../../node_modules/json-server/dist/')
});

server.use(middlewares);
server.use(bodyParser.json());
server.use(pause(500));

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/regionalMetricValues\\(:metricValueId\\)')
  .patch(({ params: { metricValueId }, body }, res) => {
    const index = regionalMetricValues.value.findIndex(({ id }) => id === metricValueId);

    if (index > -1) {
      const regionalMetricValue = regionalMetricValues.value[index];

      regionalMetricValue.value = body[0].value;
      res.json(regionalMetricValue);
    } else {
      res.sendStatus(404);
    }
  });

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/regionalMetricValues')
  .get(({ params: { organizationId }, query: { $filter } }, res) => {
    let metricValues = { value: [] };
    const { periodId, regionId: regionIds, regionalMetricId: metricIds } = odataFilterParser($filter);
    const { name: contractorName } = fixtures.contractors.find(contractor => contractor.id === organizationId);

    const createMetricValues = regionId =>
      metricIds.map(regionalMetricId =>
        metricValues.value.push({
          id: faker.random.uuid(),
          regionId,
          regionalMetricId,
          periodId: periodId,
          contractorId: organizationId,
          contractorName,
          value: faker.random.number({ min: 0 })
        })
      );

    if (regionIds) {
      Array.isArray(regionIds)
        ? regionIds.map(regionId => createMetricValues(regionId))
        : createMetricValues(regionIds);
    } else {
      metricValues = regionalMetricValues;
    }

    return res.json(metricValues);
  });

server
  .route('/api/v3.01/organizations\\(:organizationId\\)/operationalMetricValues')
  .get(({ params: { organizationId }, query: { $filter } }, res) => {
    let metricValues = { value: [] };
    const { periodId, operationalMetricId: metricIds } = odataFilterParser($filter);
    const { name: contractorName } = fixtures.contractors.find(contractor => contractor.id === organizationId);

    const createMetricValues = operationalMetricId => {
      const operationalMetric = fixtures.operationalMetrics.value.find(
        operationalMetric => operationalMetric.id === operationalMetricId
      );

      metricValues.value.push({
        id: faker.random.uuid(),
        operationalMetricId,
        periodId: periodId,
        contractorId: organizationId,
        contractorName,
        value:
          operationalMetric && operationalMetric.valueType === 'Double'
            ? faker.random.number({ min: 0 })
            : faker.random.arrayElement(['Yes', 'No'])
      });
    };

    if (metricIds) {
      Array.isArray(metricIds)
        ? metricIds.map(operationalMetricId => createMetricValues(operationalMetricId))
        : createMetricValues(metricIds);
    } else {
      metricValues = operationalMetricValues;
    }

    return res.json(metricValues);
  });

const sortComparator = (a, b) => a.name.localeCompare(b.name);

server.route('/api/v3.01/incidentCategories').get(({ query: { $filter } }, res) => {
  const { clientId, status } = odataFilterParser($filter);
  const value =
    clientId && status
      ? incidentCategories.filter(t => t.clientId === clientId && toArray(status).includes(t.status))
      : incidentCategories;

  return res.json({ value: value.sort(sortComparator) });
});

server.route('/api/v3.01/incidentRootCauses').get(({ query: { $filter } }, res) => {
  const { clientId, status } = odataFilterParser($filter);
  const value =
    clientId && status
      ? incidentRootCauses.filter(t => t.clientId === clientId && toArray(status).includes(t.status))
      : incidentRootCauses;

  return res.json({ value: value.sort(sortComparator) });
});

server.route('/api/v3.01/incidentTypes').get(({ query: { $filter } }, res) => {
  const { clientId, status } = odataFilterParser($filter);
  const value =
    clientId && status
      ? incidentTypes.filter(t => t.clientId === clientId && toArray(status).includes(t.status))
      : incidentTypes;

  return res.json({ value: value.sort(sortComparator) });
});

server.route('/api/v3.01/operationalContractorPeriods').get(({ query: { $filter, $top } }, res) => {
  const { clientId, periodId } = odataFilterParser($filter);

  const value =
    clientId && periodId
      ? contractorPeriods.filter(cp => cp.clientId === clientId && cp.periodId === periodId)
      : contractorPeriods;

  const response = { value };

  if ($top) {
    response['@odata.count'] = value.length;
  }

  return res.json(response);
});

server.route('/api/v3.01/regionalContractorPeriods').get(({ query: { $filter, $top } }, res) => {
  const { clientId, periodId } = odataFilterParser($filter);

  const value =
    clientId && periodId
      ? contractorPeriods.filter(cp => cp.clientId === clientId && cp.periodId === periodId)
      : contractorPeriods;

  const response = { value };

  if ($top) {
    response['@odata.count'] = value.length;
  }

  return res.json(response);
});

server.route('/api/v3.01/regionalChangeLog').get(({ query: { $filter } }, res) => {
  const { periodId, createdByOrganizationId } = odataFilterParser($filter);

  const results =
    periodId && createdByOrganizationId
      ? regionalChangeLog.value.filter(
          cl => cl.periodId === periodId && cl.createdByOrganizationId === createdByOrganizationId
        )
      : regionalChangeLog;

  return res.json({ value: results });
});

server.use(jsonServer.rewriter(routes));
server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
