import { ITableOption } from '@pec/aion-ui-components/interfaces/tableOption';

export interface ITaskGroupContractorsTableOption extends ITableOption {
  status: JSX.Element;
  assigneeName: string;
  attachments?: JSX.Element;
  tags?: JSX.Element;
  taskId: string;
}
