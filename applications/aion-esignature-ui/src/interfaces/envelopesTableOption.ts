import { ITableOption } from '@pec/aion-ui-components/interfaces/tableOption';

export interface IEnvelopesTableOption extends ITableOption {
  assigneeTypeName: string;
  status: JSX.Element;
  documentFileName: JSX.Element;
  ownerTypeName: string;
  createdBy: string;
  updatedDateUtc: string;
}
