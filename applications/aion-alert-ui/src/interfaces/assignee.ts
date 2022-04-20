import { IAssigneeGroup } from '@pec/aion-ui-core/interfaces/assigneeGroup';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

export interface IAssignee {
  assigneeId: string;
  assigneeName: string;
  assigneeGroups: IAssigneeGroup[];
  status: TaskStatus;
  assigneeRepliedCount: number;
  ownerRepliedCount: number;
  submittedCount: number;
  incompleteCount: number;
  completeCount: number;
}
