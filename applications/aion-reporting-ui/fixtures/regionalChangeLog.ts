import { IRegionalChangeLogEntry } from '../src/interfaces/regionalChangeLogEntry';

export const regionalChangeLog: { value: IRegionalChangeLogEntry[] } = {
  value: [
    {
      id: '32b2739b-0f28-490f-b282-7ee285588d56',
      periodId: 'b2f49d2d-0c57-49d0-b9d5-16c571897e01',
      regionalContractorPeriodId: '32adf88c-3dd2-435f-b05a-9e125c9acfee',
      createdDateUtc: '2019-08-23T02:00:00Z',
      createdByOrganizationId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
      createdByUserId: '42c038cf-4d8e-47ae-868b-777ac0db19a9',
      createdByUserFullName: 'Kenny Powers',
      description: 'Corrected a typo. Sorry, fat fingers!'
    },
    {
      id: 'b0690dad-bc5a-4b09-a8da-f5b52a4a93b6',
      periodId: 'b2f49d2d-0c57-49d0-b9d5-16c571897e01',
      regionalContractorPeriodId: '32adf88c-3dd2-435f-b05a-9e125c9acfee',
      createdDateUtc: '2019-08-24T11:25:41Z',
      createdByOrganizationId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
      createdByUserId: '3e56658b-5666-4dab-bfe2-2b2d798a1221',
      createdByUserFullName: 'Tabitha McDowell',
      description:
        'Kenny is out riding his jet ski today, but he called me this morning and asked me to make this change.'
    }
  ]
};
