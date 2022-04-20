import { IClientPeriod, PeriodDuration } from '../src/interfaces/clientPeriod';

const { Monthly } = PeriodDuration;

export const clientPeriods: { value: IClientPeriod[] } = {
  value: [
    {
      id: 'fcb394c7-5e93-4697-b225-218943d2a9f5',
      clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
      startDate: '2018-12-01',
      endDate: '2018-12-31',
      duration: Monthly,
      gracePeriodMillis: 8 * 24 * 60 * 60 * 1000
    },
    {
      id: '2287783d-050e-4ff7-9578-fafbdde4716a',
      clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
      startDate: '2018-11-01',
      endDate: '2018-11-30',
      duration: Monthly,
      gracePeriodMillis: 8 * 24 * 60 * 60 * 1000
    },
    {
      id: 'b2f49d2d-0c57-49d0-b9d5-16c571897e01',
      clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
      startDate: '2018-10-01',
      endDate: '2018-10-31',
      duration: Monthly,
      gracePeriodMillis: 8 * 24 * 60 * 60 * 1000
    },
    {
      id: '68960e53-b84b-4f02-a3b2-0c78fc20c7e4',
      clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
      startDate: '2018-09-01',
      endDate: '2018-09-30',
      duration: Monthly,
      gracePeriodMillis: 8 * 24 * 60 * 60 * 1000
    },
    {
      id: 'b423a512-dc59-4277-9e9b-b8244569c16a',
      clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
      startDate: '2018-08-01',
      endDate: '2018-08-30',
      duration: Monthly,
      gracePeriodMillis: 8 * 24 * 60 * 60 * 1000
    },
    {
      id: 'e389b258-830c-4b77-9989-578a76cc9b9e',
      clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
      startDate: '2018-07-01',
      endDate: '2018-07-31',
      duration: Monthly,
      gracePeriodMillis: 8 * 24 * 60 * 60 * 1000
    }
  ]
};
