import { groupByYear } from './groupByYear';

describe('groupByYear helper', () => {
  const contentTest = [
    {
      year: 2020,
      violationType: 'R',
      count: 2,
      organizationId: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4'
    },
    {
      year: 2020,
      violationType: 'O',
      count: 5,
      organizationId: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4'
    },
    {
      year: 2018,
      violationType: 'O',
      count: 10,
      organizationId: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4'
    },
    {
      year: 2021,
      violationType: 'S',
      count: 1,
      organizationId: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4'
    }
  ];

  it('return right total violation count per year and respectives types count', async () => {
    let totalCountTest = groupByYear(contentTest);

    expect(totalCountTest).toEqual([
      { year: '2021', count: 1, types: { O: 0, R: 0, S: 1, W: 0 } },
      { year: '2020', count: 7, types: { O: 5, R: 2, S: 0, W: 0 } },
      { year: '2019', count: 0, types: { O: 0, R: 0, S: 0, W: 0 } },
      { year: '2018', count: 10, types: { O: 10, R: 0, S: 0, W: 0 } }
    ]);
  });
});
