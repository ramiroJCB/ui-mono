import { IMetricContractor } from './metricContractor';
import { IOperationalMetric } from './operationalMetric';
import { IPeriodStatus } from './periodStatus';

export interface IClientOperationsForm {
  contractors: IMetricContractor[];
  operationalMetrics: IOperationalMetric[];
  periodStatuses: IPeriodStatus[];
}
