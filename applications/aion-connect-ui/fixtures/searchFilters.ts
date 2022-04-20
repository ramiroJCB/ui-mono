import * as faker from 'faker';
import { ISearchFilters } from '../src/interfaces/searchFilters';
import { PredictiveRanking } from '../src/interfaces/searchResult';

const { Standard, Elevated, High } = PredictiveRanking;
export const searchFilters: ISearchFilters = {
  employeeCounts: Array(faker.random.number(15))
    .fill(null)
    .map(() => faker.random.number(250)),
  naicsCodes: Array(faker.random.number(15))
    .fill(null)
    .map(() => `${faker.random.alphaNumeric(10)} - ${faker.company.bsBuzz()}`),
  tags: Array(faker.random.number(15))
    .fill(null)
    .map(() => faker.company.bsBuzz()),
  businessUnits: Array(faker.random.number(15))
    .fill(null)
    .map(() => faker.company.bsBuzz()),
  predictiveRankings: Array(faker.random.number(15))
    .fill(null)
    .map(() => faker.random.arrayElement([Standard, Elevated, High, null]))
};
