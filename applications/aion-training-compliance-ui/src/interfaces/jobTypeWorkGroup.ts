import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';

export interface IJobTypeWorkGroup extends IWorkGroupJobType {
  workGroup: IWorkGroup;
}
