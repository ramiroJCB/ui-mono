import { DisplayPeriodStatus } from './contractorPeriod';
import { IMappedRegionMetrics } from './mappedRegionMetrics';

export interface IContractorRegionalForm {
  periodId: string;
  status: DisplayPeriodStatus;
  contractorId: string;
  regions: IMappedRegionMetrics[];
  description?: string;
}
