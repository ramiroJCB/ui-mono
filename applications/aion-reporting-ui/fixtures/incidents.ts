import * as faker from 'faker';
import { IIncident } from '../src/interfaces/incident';
import { incidentCategories } from './incidentCategories';
import { incidentRegions } from './incidentRegions';
import { incidentRootCauses } from './incidentRootCauses';
import { incidentTypes } from './incidentTypes';
import { incidentWorkGroups } from './incidentWorkGroups';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const latitudeMin = -85;
const latitudeMax = 85;
const longitudeMin = -180;
const longitudeMax = 180;
const latLongPrecision = 0.0001;

export const incidents: IIncident[] = [
  {
    id: '0ffb1773-f1a8-4836-9cb3-16bdc6e8e760',
    clientId: organizations[0].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[0].id,
    incidentTypeId: incidentTypes[0].id,
    incidentRootCauseId: incidentRootCauses[0].id,
    incidentRegionId: incidentRegions[0].id,
    incidentWorkGroupId: incidentWorkGroups[0].id,
    incidentNumber: 5001,
    occurredOnDateUtc: '2016-04-20T00:00:00',
    createdDateUtc: '2016-04-20T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: faker.random.number({ min: latitudeMin, max: latitudeMax, precision: latLongPrecision }),
    longitude: faker.random.number({ min: longitudeMin, max: longitudeMax, precision: latLongPrecision }),
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[0].name,
      incidentCategoryStatus: incidentCategories[0].status,
      incidentTypeName: incidentTypes[0].name,
      incidentTypeStatus: incidentTypes[0].status,
      incidentRootCauseName: incidentRootCauses[0].name,
      incidentRootCauseStatus: incidentRootCauses[0].status,
      incidentRegionName: incidentRegions[0].name,
      incidentRegionStatus: incidentRegions[0].status,
      incidentWorkGroupName: incidentWorkGroups[0].name,
      incidentWorkGroupStatus: incidentWorkGroups[0].status
    }
  },
  {
    id: 'b3015c5e-d90e-4cf9-87ba-0a8d89897262',
    clientId: organizations[0].id,
    contractorId: organizations[5].id,
    incidentCategoryId: incidentCategories[0].id,
    incidentTypeId: incidentTypes[10].id,
    incidentRootCauseId: incidentRootCauses[1].id,
    incidentRegionId: incidentRegions[1].id,
    incidentWorkGroupId: incidentWorkGroups[1].id,
    incidentNumber: 5002,
    occurredOnDateUtc: '2016-11-06T00:00:00',
    createdDateUtc: '2016-11-07T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[5].name,
      incidentCategoryName: incidentCategories[0].name,
      incidentCategoryStatus: incidentCategories[0].status,
      incidentTypeName: incidentTypes[10].name,
      incidentTypeStatus: incidentTypes[10].status,
      incidentRootCauseName: incidentRootCauses[1].name,
      incidentRootCauseStatus: incidentRootCauses[1].status,
      incidentRegionName: incidentRegions[1].name,
      incidentRegionStatus: incidentRegions[1].status,
      incidentWorkGroupName: incidentWorkGroups[1].name,
      incidentWorkGroupStatus: incidentWorkGroups[1].status
    }
  },
  {
    id: 'c66cbcc5-8f2e-44a4-8b47-6ab7358e4174',
    clientId: organizations[0].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[0].id,
    incidentTypeId: incidentTypes[7].id,
    incidentRootCauseId: incidentRootCauses[0].id,
    incidentRegionId: incidentRegions[0].id,
    incidentWorkGroupId: incidentWorkGroups[0].id,
    incidentNumber: 5003,
    occurredOnDateUtc: '2018-01-13T00:00:00',
    createdDateUtc: '2018-01-13T00:00:00',
    details: faker.lorem.paragraphs(2),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[0].name,
      incidentCategoryStatus: incidentCategories[0].status,
      incidentTypeName: incidentTypes[7].name,
      incidentTypeStatus: incidentTypes[7].status,
      incidentRootCauseName: incidentRootCauses[0].name,
      incidentRootCauseStatus: incidentRootCauses[0].status,
      incidentRegionName: incidentRegions[0].name,
      incidentRegionStatus: incidentRegions[0].status,
      incidentWorkGroupName: incidentWorkGroups[0].name,
      incidentWorkGroupStatus: incidentWorkGroups[0].status
    }
  },
  {
    id: 'c60260ff-529d-4ed9-94ac-1e7fb479c8b4',
    clientId: organizations[0].id,
    contractorId: organizations[6].id,
    incidentCategoryId: incidentCategories[0].id,
    incidentTypeId: incidentTypes[0].id,
    incidentRootCauseId: incidentRootCauses[0].id,
    incidentRegionId: incidentRegions[0].id,
    incidentWorkGroupId: incidentWorkGroups[0].id,
    incidentNumber: 5004,
    occurredOnDateUtc: '2018-05-21T00:00:00',
    createdDateUtc: '2018-05-22T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[6].name,
      incidentCategoryName: incidentCategories[0].name,
      incidentCategoryStatus: incidentCategories[0].status,
      incidentTypeName: incidentTypes[0].name,
      incidentTypeStatus: incidentTypes[0].status,
      incidentRootCauseName: incidentRootCauses[0].name,
      incidentRootCauseStatus: incidentRootCauses[0].status,
      incidentRegionName: incidentRegions[0].name,
      incidentRegionStatus: incidentRegions[0].status,
      incidentWorkGroupName: incidentWorkGroups[0].name,
      incidentWorkGroupStatus: incidentWorkGroups[0].status
    }
  },
  {
    id: 'e60a054f-5c69-4f0e-b187-4f862f46683a',
    clientId: organizations[0].id,
    contractorId: organizations[7].id,
    incidentCategoryId: incidentCategories[1].id,
    incidentTypeId: incidentTypes[2].id,
    incidentRootCauseId: incidentRootCauses[1].id,
    incidentRegionId: incidentRegions[1].id,
    incidentWorkGroupId: incidentWorkGroups[1].id,
    incidentNumber: 5005,
    occurredOnDateUtc: '2018-06-12T00:00:00',
    createdDateUtc: '2018-06-12T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[7].name,
      incidentCategoryName: incidentCategories[1].name,
      incidentCategoryStatus: incidentCategories[1].status,
      incidentTypeName: incidentTypes[2].name,
      incidentTypeStatus: incidentTypes[2].status,
      incidentRootCauseName: incidentRootCauses[1].name,
      incidentRootCauseStatus: incidentRootCauses[1].status,
      incidentRegionName: incidentRegions[1].name,
      incidentRegionStatus: incidentRegions[1].status,
      incidentWorkGroupName: incidentWorkGroups[1].name,
      incidentWorkGroupStatus: incidentWorkGroups[1].status
    }
  },
  {
    id: '3b9c9ea4-fcd1-4009-9908-4be9a78df77d',
    clientId: organizations[0].id,
    contractorId: organizations[5].id,
    incidentCategoryId: incidentCategories[1].id,
    incidentTypeId: incidentTypes[3].id,
    incidentRootCauseId: incidentRootCauses[1].id,
    incidentRegionId: incidentRegions[1].id,
    incidentWorkGroupId: incidentWorkGroups[1].id,
    incidentNumber: 5006,
    occurredOnDateUtc: '2018-06-16T00:00:00',
    createdDateUtc: '2018-06-17T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[5].name,
      incidentCategoryName: incidentCategories[1].name,
      incidentCategoryStatus: incidentCategories[1].status,
      incidentTypeName: incidentTypes[3].name,
      incidentTypeStatus: incidentTypes[3].status,
      incidentRootCauseName: incidentRootCauses[1].name,
      incidentRootCauseStatus: incidentRootCauses[1].status,
      incidentRegionName: incidentRegions[1].name,
      incidentRegionStatus: incidentRegions[1].status,
      incidentWorkGroupName: incidentWorkGroups[1].name,
      incidentWorkGroupStatus: incidentWorkGroups[1].status
    }
  },
  {
    id: '7821fd47-cd7f-4c01-a6dd-4053b11dee1f',
    clientId: organizations[0].id,
    contractorId: organizations[5].id,
    incidentCategoryId: incidentCategories[1].id,
    incidentTypeId: incidentTypes[6].id,
    incidentRootCauseId: incidentRootCauses[0].id,
    incidentRegionId: incidentRegions[0].id,
    incidentWorkGroupId: incidentWorkGroups[0].id,
    incidentNumber: 5007,
    occurredOnDateUtc: '2018-07-14T00:00:00',
    createdDateUtc: '2018-07-14T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[5].name,
      incidentCategoryName: incidentCategories[1].name,
      incidentCategoryStatus: incidentCategories[1].status,
      incidentTypeName: incidentTypes[6].name,
      incidentTypeStatus: incidentTypes[6].status,
      incidentRootCauseName: incidentRootCauses[0].name,
      incidentRootCauseStatus: incidentRootCauses[0].status,
      incidentRegionName: incidentRegions[0].name,
      incidentRegionStatus: incidentRegions[0].status,
      incidentWorkGroupName: incidentWorkGroups[0].name,
      incidentWorkGroupStatus: incidentWorkGroups[0].status
    }
  },
  {
    id: '31c6b447-b78e-4791-aa6c-c20a01c9ef3f',
    clientId: organizations[0].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[0].id,
    incidentTypeId: incidentTypes[7].id,
    incidentRootCauseId: incidentRootCauses[0].id,
    incidentRegionId: incidentRegions[0].id,
    incidentWorkGroupId: incidentWorkGroups[0].id,
    incidentNumber: 5008,
    occurredOnDateUtc: '2018-07-18T00:00:00',
    createdDateUtc: '2018-07-18T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[0].name,
      incidentCategoryStatus: incidentCategories[0].status,
      incidentTypeName: incidentTypes[7].name,
      incidentTypeStatus: incidentTypes[7].status,
      incidentRootCauseName: incidentRootCauses[0].name,
      incidentRootCauseStatus: incidentRootCauses[0].status,
      incidentRegionName: incidentRegions[0].name,
      incidentRegionStatus: incidentRegions[0].status,
      incidentWorkGroupName: incidentWorkGroups[0].name,
      incidentWorkGroupStatus: incidentWorkGroups[0].status
    }
  },
  {
    id: 'f3800f4f-7ca7-4b27-9c77-bc86b3e60b02',
    clientId: organizations[0].id,
    contractorId: organizations[6].id,
    incidentCategoryId: incidentCategories[1].id,
    incidentTypeId: incidentTypes[7].id,
    incidentRootCauseId: incidentRootCauses[1].id,
    incidentRegionId: incidentRegions[1].id,
    incidentWorkGroupId: incidentWorkGroups[1].id,
    incidentNumber: 5009,
    occurredOnDateUtc: '2018-10-02T00:00:00',
    createdDateUtc: '2018-10-03T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[6].name,
      incidentCategoryName: incidentCategories[1].name,
      incidentCategoryStatus: incidentCategories[1].status,
      incidentTypeName: incidentTypes[7].name,
      incidentTypeStatus: incidentTypes[7].status,
      incidentRootCauseName: incidentRootCauses[1].name,
      incidentRootCauseStatus: incidentRootCauses[1].status,
      incidentRegionName: incidentRegions[1].name,
      incidentRegionStatus: incidentRegions[1].status,
      incidentWorkGroupName: incidentWorkGroups[1].name,
      incidentWorkGroupStatus: incidentWorkGroups[1].status
    }
  },
  {
    id: 'd69ea6f7-e055-436f-96f2-9009670d789e',
    clientId: organizations[0].id,
    contractorId: organizations[5].id,
    incidentCategoryId: incidentCategories[0].id,
    incidentTypeId: incidentTypes[10].id,
    incidentRootCauseId: incidentRootCauses[2].id,
    incidentRegionId: incidentRegions[2].id,
    incidentWorkGroupId: incidentWorkGroups[2].id,
    incidentNumber: 5010,
    occurredOnDateUtc: '2018-12-23T00:00:00',
    createdDateUtc: '2018-12-23T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[5].name,
      incidentCategoryName: incidentCategories[0].name,
      incidentCategoryStatus: incidentCategories[0].status,
      incidentTypeName: incidentTypes[10].name,
      incidentTypeStatus: incidentTypes[10].status,
      incidentRootCauseName: incidentRootCauses[2].name,
      incidentRootCauseStatus: incidentRootCauses[2].status,
      incidentRegionName: incidentRegions[2].name,
      incidentRegionStatus: incidentRegions[2].status,
      incidentWorkGroupName: incidentWorkGroups[2].name,
      incidentWorkGroupStatus: incidentWorkGroups[2].status
    }
  },
  {
    id: 'c3957ee2-09b6-4509-a599-179d5548ddaa',
    clientId: organizations[0].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[1].id,
    incidentTypeId: incidentTypes[9].id,
    incidentRootCauseId: incidentRootCauses[0].id,
    incidentRegionId: incidentRegions[0].id,
    incidentWorkGroupId: incidentWorkGroups[0].id,
    incidentNumber: 5011,
    occurredOnDateUtc: '2018-12-27T00:00:00',
    createdDateUtc: '2018-12-27T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[1].name,
      incidentCategoryStatus: incidentCategories[1].status,
      incidentTypeName: incidentTypes[9].name,
      incidentTypeStatus: incidentTypes[9].status,
      incidentRootCauseName: incidentRootCauses[0].name,
      incidentRootCauseStatus: incidentRootCauses[0].status,
      incidentRegionName: incidentRegions[0].name,
      incidentRegionStatus: incidentRegions[0].status,
      incidentWorkGroupName: incidentWorkGroups[0].name,
      incidentWorkGroupStatus: incidentWorkGroups[0].status
    }
  },
  {
    id: '5ce20a26-aee3-412b-88ce-e2e35e0a080c',
    clientId: organizations[0].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[2].id,
    incidentTypeId: incidentTypes[11].id,
    incidentRootCauseId: incidentRootCauses[0].id,
    incidentRegionId: incidentRegions[0].id,
    incidentWorkGroupId: incidentWorkGroups[0].id,
    incidentNumber: 5012,
    occurredOnDateUtc: '2018-12-28T00:00:00',
    createdDateUtc: '2018-12-28T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[2].name,
      incidentCategoryStatus: incidentCategories[2].status,
      incidentTypeName: incidentTypes[11].name,
      incidentTypeStatus: incidentTypes[11].status,
      incidentRootCauseName: incidentRootCauses[0].name,
      incidentRootCauseStatus: incidentRootCauses[0].status,
      incidentRegionName: incidentRegions[0].name,
      incidentRegionStatus: incidentRegions[0].status,
      incidentWorkGroupName: incidentWorkGroups[0].name,
      incidentWorkGroupStatus: incidentWorkGroups[0].status
    }
  },
  {
    id: '6b55527a-cf71-4f4c-ac17-fb6bc624366c',
    clientId: organizations[0].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[2].id,
    incidentTypeId: incidentTypes[8].id,
    incidentRootCauseId: incidentRootCauses[1].id,
    incidentRegionId: incidentRegions[1].id,
    incidentWorkGroupId: incidentWorkGroups[1].id,
    incidentNumber: 5013,
    occurredOnDateUtc: '2019-01-01T00:00:00',
    createdDateUtc: '2019-01-02T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[0].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[2].name,
      incidentCategoryStatus: incidentCategories[2].status,
      incidentTypeName: incidentTypes[8].name,
      incidentTypeStatus: incidentTypes[8].status,
      incidentRootCauseName: incidentRootCauses[1].name,
      incidentRootCauseStatus: incidentRootCauses[1].status,
      incidentRegionName: incidentRegions[1].name,
      incidentRegionStatus: incidentRegions[1].status,
      incidentWorkGroupName: incidentWorkGroups[1].name,
      incidentWorkGroupStatus: incidentWorkGroups[1].status
    }
  },
  {
    id: 'da6b43f8-e902-413e-8fd8-c8fd545ab9ab',
    clientId: organizations[3].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[3].id,
    incidentTypeId: incidentTypes[18].id,
    incidentRootCauseId: incidentRootCauses[3].id,
    incidentRegionId: incidentRegions[3].id,
    incidentWorkGroupId: incidentWorkGroups[3].id,
    incidentNumber: 5014,
    occurredOnDateUtc: '2019-01-05T00:00:00',
    createdDateUtc: '2019-01-05T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[3].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[3].name,
      incidentCategoryStatus: incidentCategories[3].status,
      incidentTypeName: incidentTypes[18].name,
      incidentTypeStatus: incidentTypes[18].status,
      incidentRootCauseName: incidentRootCauses[3].name,
      incidentRootCauseStatus: incidentRootCauses[3].status,
      incidentRegionName: incidentRegions[3].name,
      incidentRegionStatus: incidentRegions[3].status,
      incidentWorkGroupName: incidentWorkGroups[3].name,
      incidentWorkGroupStatus: incidentWorkGroups[3].status
    }
  },
  {
    id: '1fa9c4e9-be2a-47a7-8f0a-684b562718ab',
    clientId: organizations[3].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[6].id,
    incidentTypeId: incidentTypes[25].id,
    incidentRootCauseId: incidentRootCauses[3].id,
    incidentRegionId: incidentRegions[3].id,
    incidentWorkGroupId: incidentWorkGroups[3].id,
    incidentNumber: 5015,
    occurredOnDateUtc: '2019-01-06T00:00:00',
    createdDateUtc: '2019-01-07T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[3].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[6].name,
      incidentCategoryStatus: incidentCategories[6].status,
      incidentTypeName: incidentTypes[25].name,
      incidentTypeStatus: incidentTypes[25].status,
      incidentRootCauseName: incidentRootCauses[3].name,
      incidentRootCauseStatus: incidentRootCauses[3].status,
      incidentRegionName: incidentRegions[3].name,
      incidentRegionStatus: incidentRegions[3].status,
      incidentWorkGroupName: incidentWorkGroups[3].name,
      incidentWorkGroupStatus: incidentWorkGroups[3].status
    }
  },
  {
    id: '5972e93b-0a5d-41f5-be2d-622f312a8b51',
    clientId: organizations[3].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[3].id,
    incidentTypeId: incidentTypes[22].id,
    incidentRootCauseId: incidentRootCauses[4].id,
    incidentRegionId: incidentRegions[4].id,
    incidentWorkGroupId: incidentWorkGroups[4].id,
    incidentNumber: 5016,
    occurredOnDateUtc: '2019-01-13T00:00:00',
    createdDateUtc: '2019-01-13T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[3].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[3].name,
      incidentCategoryStatus: incidentCategories[3].status,
      incidentTypeName: incidentTypes[22].name,
      incidentTypeStatus: incidentTypes[22].status,
      incidentRootCauseName: incidentRootCauses[4].name,
      incidentRootCauseStatus: incidentRootCauses[4].status,
      incidentRegionName: incidentRegions[4].name,
      incidentRegionStatus: incidentRegions[4].status,
      incidentWorkGroupName: incidentWorkGroups[4].name,
      incidentWorkGroupStatus: incidentWorkGroups[4].status
    }
  },
  {
    id: 'e56b2d63-fb79-4fef-8837-762e85f0ad97',
    clientId: organizations[3].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[4].id,
    incidentTypeId: incidentTypes[19].id,
    incidentRootCauseId: incidentRootCauses[5].id,
    incidentRegionId: incidentRegions[5].id,
    incidentWorkGroupId: incidentWorkGroups[5].id,
    incidentNumber: 5017,
    occurredOnDateUtc: '2019-01-16T00:00:00',
    createdDateUtc: '2019-01-17T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[3].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[4].name,
      incidentCategoryStatus: incidentCategories[4].status,
      incidentTypeName: incidentTypes[19].name,
      incidentTypeStatus: incidentTypes[19].status,
      incidentRootCauseName: incidentRootCauses[5].name,
      incidentRootCauseStatus: incidentRootCauses[5].status,
      incidentRegionName: incidentRegions[5].name,
      incidentRegionStatus: incidentRegions[5].status,
      incidentWorkGroupName: incidentWorkGroups[5].name,
      incidentWorkGroupStatus: incidentWorkGroups[5].status
    }
  },
  {
    id: '743a574e-92f2-4291-a11c-76550d7a3f76',
    clientId: organizations[3].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[4].id,
    incidentTypeId: incidentTypes[23].id,
    incidentRootCauseId: incidentRootCauses[6].id,
    incidentRegionId: incidentRegions[6].id,
    incidentWorkGroupId: incidentWorkGroups[6].id,
    incidentNumber: 5018,
    occurredOnDateUtc: '2019-01-17T00:00:00',
    createdDateUtc: '2019-01-17T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[3].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[4].name,
      incidentCategoryStatus: incidentCategories[4].status,
      incidentTypeName: incidentTypes[23].name,
      incidentTypeStatus: incidentTypes[23].status,
      incidentRootCauseName: incidentRootCauses[6].name,
      incidentRootCauseStatus: incidentRootCauses[6].status,
      incidentRegionName: incidentRegions[6].name,
      incidentRegionStatus: incidentRegions[6].status,
      incidentWorkGroupName: incidentWorkGroups[6].name,
      incidentWorkGroupStatus: incidentWorkGroups[6].status
    }
  },
  {
    id: 'b106c966-c5db-4037-b041-73c8926614a8',
    clientId: organizations[3].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[6].id,
    incidentTypeId: incidentTypes[20].id,
    incidentRootCauseId: incidentRootCauses[5].id,
    incidentRegionId: incidentRegions[5].id,
    incidentWorkGroupId: incidentWorkGroups[5].id,
    incidentNumber: 5019,
    occurredOnDateUtc: '2019-01-19T00:00:00',
    createdDateUtc: '2019-01-19T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[3].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[6].name,
      incidentCategoryStatus: incidentCategories[6].status,
      incidentTypeName: incidentTypes[20].name,
      incidentTypeStatus: incidentTypes[20].status,
      incidentRootCauseName: incidentRootCauses[5].name,
      incidentRootCauseStatus: incidentRootCauses[5].status,
      incidentRegionName: incidentRegions[5].name,
      incidentRegionStatus: incidentRegions[5].status,
      incidentWorkGroupName: incidentWorkGroups[5].name,
      incidentWorkGroupStatus: incidentWorkGroups[5].status
    }
  },
  {
    id: '17d1131c-f53c-417c-a485-6b97007f8ab7',
    clientId: organizations[3].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[5].id,
    incidentTypeId: incidentTypes[21].id,
    incidentRootCauseId: incidentRootCauses[4].id,
    incidentRegionId: incidentRegions[4].id,
    incidentWorkGroupId: incidentWorkGroups[4].id,
    incidentNumber: 5020,
    occurredOnDateUtc: '2019-01-23T00:00:00',
    createdDateUtc: '2019-01-23T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[3].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[5].name,
      incidentCategoryStatus: incidentCategories[5].status,
      incidentTypeName: incidentTypes[21].name,
      incidentTypeStatus: incidentTypes[21].status,
      incidentRootCauseName: incidentRootCauses[4].name,
      incidentRootCauseStatus: incidentRootCauses[4].status,
      incidentRegionName: incidentRegions[4].name,
      incidentRegionStatus: incidentRegions[4].status,
      incidentWorkGroupName: incidentWorkGroups[4].name,
      incidentWorkGroupStatus: incidentWorkGroups[4].status
    }
  },
  {
    id: 'bcfe7822-9d12-4b88-9e0d-2ec9a53f4629',
    clientId: organizations[3].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[3].id,
    incidentTypeId: incidentTypes[25].id,
    incidentRootCauseId: incidentRootCauses[3].id,
    incidentRegionId: incidentRegions[3].id,
    incidentWorkGroupId: incidentWorkGroups[3].id,
    incidentNumber: 5021,
    occurredOnDateUtc: '2019-02-12T00:00:00',
    createdDateUtc: '2019-02-12T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[3].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[3].name,
      incidentCategoryStatus: incidentCategories[3].status,
      incidentTypeName: incidentTypes[25].name,
      incidentTypeStatus: incidentTypes[25].status,
      incidentRootCauseName: incidentRootCauses[3].name,
      incidentRootCauseStatus: incidentRootCauses[3].status,
      incidentRegionName: incidentRegions[3].name,
      incidentRegionStatus: incidentRegions[3].status,
      incidentWorkGroupName: incidentWorkGroups[3].name,
      incidentWorkGroupStatus: incidentWorkGroups[3].status
    }
  },
  {
    id: 'e3fc6123-8e00-45ac-89e2-c554a622c0a5',
    clientId: organizations[3].id,
    contractorId: organizations[2].id,
    incidentCategoryId: incidentCategories[5].id,
    incidentTypeId: incidentTypes[24].id,
    incidentRootCauseId: incidentRootCauses[3].id,
    incidentRegionId: incidentRegions[3].id,
    incidentWorkGroupId: incidentWorkGroups[3].id,
    incidentNumber: 5022,
    occurredOnDateUtc: '2019-02-26T00:00:00',
    createdDateUtc: '2019-02-27T00:00:00',
    details: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
    latitude: null,
    longitude: null,
    formattedAddress: null,
    meta: {
      clientName: organizations[3].name,
      contractorName: organizations[2].name,
      incidentCategoryName: incidentCategories[5].name,
      incidentCategoryStatus: incidentCategories[5].status,
      incidentTypeName: incidentTypes[24].name,
      incidentTypeStatus: incidentTypes[24].status,
      incidentRootCauseName: incidentRootCauses[3].name,
      incidentRootCauseStatus: incidentRootCauses[3].status,
      incidentRegionName: incidentRegions[3].name,
      incidentRegionStatus: incidentRegions[3].status,
      incidentWorkGroupName: incidentWorkGroups[3].name,
      incidentWorkGroupStatus: incidentWorkGroups[3].status
    }
  }
];
