import { ITableOption } from '@pec/aion-ui-components/interfaces/tableOption';

export interface IClientContractorTasksTableOption extends ITableOption {
  taskGroupId: string;
  taskGroupSubject: string;
  status: JSX.Element;
  attachments?: JSX.Element;
  dueDate: string;
}
