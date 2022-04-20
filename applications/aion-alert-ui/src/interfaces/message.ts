import { IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';

export interface IMessage {
  threadId?: string;
  senderType: SenderType;
  senderId: string;
  attachments: IAttachmentWithStatus[];
  content: string;
  recipients: IRecipient[];
}

export interface ICreatedMessage extends IMessage {
  id: string;
  senderName: string;
  isDeleted: boolean;
  createdByUserId: string;
  createdByUserName: string;
  createdDateUtc: string;
}

interface IRecipient {
  id?: string;
  type: RecipientType;
  typeId: string;
  name?: string;
  isRead?: boolean;
  readByUserId?: string;
  readDateUtc?: string;
}

export enum SenderType {
  Organization = 'Organization'
}

export enum RecipientType {
  Organization = 'Organization'
}
