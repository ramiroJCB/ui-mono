import { ITableOption } from '@pec/aion-ui-components/interfaces/tableOption';

export interface ITaskGroupTableOption extends ITableOption {
  status: JSX.Element;
  dueDateUtc: string;
  createdDateUtc: string;
  assigneeCount: string;
  attachments?: JSX.Element;
  tags?: JSX.Element;
}
