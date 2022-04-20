import { ITableOption } from '@pec/aion-ui-components/interfaces/tableOption';

export interface IContractorTaskTableOption extends ITableOption {
  status: JSX.Element;
  attachments?: JSX.Element;
  taskGroupSubject: string;
  dueDateUtc: string;
  clientName: string;
  taskGroupContent: JSX.Element;
}
