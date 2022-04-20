import { IContractorPeriod, PeriodStatus } from '../src/interfaces/contractorPeriod';
import { PeriodDuration } from '../src/interfaces/clientPeriod';

const { Saved, Submitted, NotSaved } = PeriodStatus;
const { Monthly } = PeriodDuration;

export const contractorPeriods: IContractorPeriod[] = [
  {
    id: 'd404e9f4-a98b-4ffb-8b28-4ced4055fefb',
    periodId: '10907c9e-8e62-42ea-903b-186895439f49',
    clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
    startDate: '2019-04-01T00:00:00',
    endDate: '2019-05-01T00:00:00',
    duration: Monthly,
    gracePeriodMillis: 8 * 24 * 60 * 60 * 1000,
    reportStatus: NotSaved,
    reportStatusUpdatedDateUtc: null,
    contractorId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
    contractorName: 'Initech'
  },
  {
    id: 'a7eb01e1-20b2-4aad-9e40-431b06f1134d',
    periodId: 'fcb394c7-5e93-4697-b225-218943d2a9f5',
    clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
    startDate: '2019-01-01T00:00:00',
    endDate: '2019-02-01T00:00:00',
    duration: Monthly,
    gracePeriodMillis: 8 * 24 * 60 * 60 * 1000,
    reportStatus: NotSaved,
    reportStatusUpdatedDateUtc: null,
    contractorId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
    contractorName: 'Initech'
  },
  {
    id: 'b265530f-6c77-4a36-93a3-50f427deb02d',
    periodId: '2287783d-050e-4ff7-9578-fafbdde4716a',
    clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
    startDate: '2018-11-01T00:00:00',
    endDate: '2018-12-01T00:00:00',
    duration: Monthly,
    gracePeriodMillis: 8 * 24 * 60 * 60 * 1000,
    reportStatus: Saved,
    reportStatusUpdatedDateUtc: '2018-12-05',
    contractorId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
    contractorName: 'Initech',
    isEditedAfterDeadline: true
  },
  {
    id: '32adf88c-3dd2-435f-b05a-9e125c9acfee',
    periodId: 'b2f49d2d-0c57-49d0-b9d5-16c571897e01',
    clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
    startDate: '2018-10-01T00:00:00',
    endDate: '2018-11-01T00:00:00',
    duration: Monthly,
    gracePeriodMillis: 8 * 24 * 60 * 60 * 1000,
    reportStatus: Submitted,
    reportStatusUpdatedDateUtc: '2018-11-10',
    contractorId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
    contractorName: 'Initech',
    isEditedAfterDeadline: false
  },
  {
    id: 'c63e0533-9b85-432e-adc1-f42508cb3d64',
    periodId: '68960e53-b84b-4f02-a3b2-0c78fc20c7e4',
    clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
    startDate: '2018-09-01T00:00:00',
    endDate: '2018-10-01T00:00:00',
    duration: Monthly,
    gracePeriodMillis: 8 * 24 * 60 * 60 * 1000,
    reportStatus: Submitted,
    reportStatusUpdatedDateUtc: '2018-10-05',
    contractorId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
    contractorName: 'Initech',
    isEditedAfterDeadline: true
  },
  {
    id: 'ff619fb8-7823-4b24-9850-9aeed1bc5305',
    periodId: 'b423a512-dc59-4277-9e9b-b8244569c16a',
    clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
    startDate: '2018-08-01T00:00:00',
    endDate: '2018-09-01T00:00:00',
    duration: Monthly,
    gracePeriodMillis: 8 * 24 * 60 * 60 * 1000,
    reportStatus: Saved,
    reportStatusUpdatedDateUtc: '2018-10-11',
    contractorId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
    contractorName: 'Initech'
  },
  {
    id: 'a71cd395-0e72-4d73-8e5f-b78324a7e0cb',
    periodId: 'e389b258-830c-4b77-9989-578a76cc9b9e',
    clientId: '750aaa27-7588-41e0-995c-cdd008285bb2',
    startDate: '2018-07-01T00:00:00',
    endDate: '2018-08-01T00:00:00',
    duration: Monthly,
    gracePeriodMillis: 8 * 24 * 60 * 60 * 1000,
    reportStatus: NotSaved,
    reportStatusUpdatedDateUtc: null,
    contractorId: '7a68109c-56bb-4c76-9629-2cc73247c1c7',
    contractorName: 'Initech'
  }
];
