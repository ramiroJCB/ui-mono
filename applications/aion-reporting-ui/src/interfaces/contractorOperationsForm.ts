import { DisplayPeriodStatus } from './contractorPeriod';
import { IOperationalMetric } from './operationalMetric';

export interface IContractorOperationsForm {
  periodId: string;
  status: DisplayPeriodStatus;
  contractorId: string;
  operationalMetrics: IOperationalMetric[];
}
