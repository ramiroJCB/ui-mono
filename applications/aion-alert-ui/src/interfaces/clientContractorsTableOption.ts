import { ITableOption } from '@pec/aion-ui-components/interfaces/tableOption';

export interface IClientContractorsTableOption extends ITableOption {
  status: JSX.Element;
  assigneeName: string;
  openTasksCount: string;
  tags?: JSX.Element;
}
