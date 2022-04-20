import { ITableOption } from '@pec/aion-ui-components/interfaces/tableOption';

export interface IClientTaskTableOption extends ITableOption {
  status: JSX.Element;
  attachments?: JSX.Element;
  taskGroupSubject: string;
  dueDateUtc: string;
  createdDateUtc: string;
  contractorName: string;
  taskNumber: number;
}
