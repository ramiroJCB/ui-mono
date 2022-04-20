import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { IServiceRegion } from '@pec/aion-ui-core/interfaces/serviceRegion';

export interface IAddWorkGroupForm {
  name: string;
  organizationId: string;
  description: string | null;
  jobTypes: IJobType[] | null;
  serviceRegions: IServiceRegion[] | null;
}
