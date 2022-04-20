import { IAssigneeDetails } from './assigneeDetails';
import { ITaskGroup, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

export interface ITaskAssigneeDetails {
  id: string;
  assignees: IAssigneeDetails[];
  taskNumber: number;
  threadId?: string;
  statuses: ITaskAssigneeStatus[];
  meta: ITaskAssigneeDetailsMeta;
}

export interface ITaskAssigneeStatus {
  id: string;
  messageId: string;
  status: TaskStatus;
  createdDateUtc: string;
}

interface ITaskAssigneeDetailsMeta {
  taskGroup: ITaskGroup;
}
