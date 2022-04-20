import { ICreatedMessage, IMessage } from './message';
import { OwnerType } from '@pec/aion-ui-core/interfaces/taskGroup';

interface BaseThread {
  ownerType: OwnerType;
  ownerId: string;
  participants: IParticipant[];
  subject: string;
  canOnlyMessageOwner: boolean;
}

export interface IThread extends BaseThread {
  messages: IMessage[];
}

export interface ICreatedThread extends BaseThread {
  id: string;
  messages: ICreatedMessage[];
}

interface IParticipant {
  type: OwnerType;
  typeId: string;
}
