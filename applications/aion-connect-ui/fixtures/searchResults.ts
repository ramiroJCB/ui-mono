import * as faker from 'faker';
import { ISearchResult, PredictiveRanking } from '../src/interfaces/searchResult';

const { Standard, Elevated, High } = PredictiveRanking;

export const searchResults: ISearchResult[] = [
  {
    id: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
    name: 'Initech',
    description:
      'Initech Corporation is a software development company focused on creating software to support supply chain management operations for hundreds of companies across the United States.',
    connectionStatus: faker.random.arrayElement(['Connected', 'Not Connected']),
    city: 'Covington',
    state: 'LA',
    zipCode: '70433',
    latitude: 30.433006,
    longitude: -90.086872,
    distance: 10,
    naicsCode: faker.random.alphaNumeric(10),
    services: faker.random.arrayElement(Array(5).fill(faker.company.bsBuzz())),
    employeeCount: faker.random.number(200),
    tags: [],
    businessUnits: [],
    predictiveRanking: faker.random.arrayElement([Standard, Elevated, High, null]),
    tradeName: null,
    profilePercentComplete: 52
  },
  {
    id: '361e1bba-fc58-4da6-9f0b-95acee9a8c93',
    name: "Frank's Fittings",
    description:
      'Our high-performance tubular steel connections are engineered and manufactured to the highest standards.',
    connectionStatus: faker.random.arrayElement(['Connected', 'Not Connected']),
    city: 'Covington',
    state: 'LA',
    zipCode: '70433',
    latitude: 30.438736,
    longitude: -90.125417,
    distance: 10,
    naicsCode: faker.random.alphaNumeric(10),
    services: faker.random.arrayElement(Array(5).fill(faker.company.bsBuzz())),
    employeeCount: faker.random.number(200),
    tags: [],
    businessUnits: [],
    predictiveRanking: faker.random.arrayElement([Standard, Elevated, High, null]),
    tradeName: null,
    profilePercentComplete: 13
  },
  {
    id: '82bc9ca7-b0d0-4253-b241-f6ce03769942',
    name: 'World Wide Concrete',
    description:
      'Worldwide Concrete is a family owned and operated local concrete contractor providing quality workmanship and excellent customer service.',
    connectionStatus: faker.random.arrayElement(['Connected', 'Not Connected']),
    city: 'Covington',
    state: 'LA',
    zipCode: '70433',
    latitude: 30.420145,
    longitude: -90.076804,
    distance: 10,
    naicsCode: faker.random.alphaNumeric(10),
    services: faker.random.arrayElement(Array(5).fill(faker.company.bsBuzz())),
    employeeCount: faker.random.number(200),
    tags: [],
    businessUnits: [],
    predictiveRanking: faker.random.arrayElement([Standard, Elevated, High, null]),
    tradeName: 'World Wide',
    profilePercentComplete: 78
  },
  {
    id: '9b85523a-13ac-4515-8df6-8d64e4d5cd0c',
    name: 'Rebar Reprobate',
    description: 'Rebar Reprobate is a leading concrete reinforcing steel fabricator in the U.S.',
    connectionStatus: faker.random.arrayElement(['Connected', 'Not Connected']),
    city: 'Covington',
    state: 'LA',
    zipCode: '70433',
    latitude: 30.410646,
    longitude: -90.076591,
    distance: 10,
    naicsCode: faker.random.alphaNumeric(10),
    services: faker.random.arrayElement(Array(5).fill(faker.company.bsBuzz())),
    employeeCount: faker.random.number(200),
    tags: [],
    businessUnits: [],
    predictiveRanking: faker.random.arrayElement([Standard, Elevated, High, null]),
    tradeName: null,
    profilePercentComplete: 91
  }
];
