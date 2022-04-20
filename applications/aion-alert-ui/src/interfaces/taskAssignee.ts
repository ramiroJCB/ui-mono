import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

export interface ITaskAssignee {
  taskId: string;
  assigneeId: string;
  assigneeName: string;
  status: TaskStatus;
  hasAttachments: boolean;
}
