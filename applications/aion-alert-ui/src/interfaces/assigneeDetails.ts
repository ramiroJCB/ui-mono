import { OwnerType } from '@pec/aion-ui-core/interfaces/taskGroup';

export interface IAssigneeDetails {
  id: string;
  type: OwnerType;
  typeId: string;
  name: string;
}
