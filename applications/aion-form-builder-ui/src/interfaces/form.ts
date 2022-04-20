export enum FormStatus {
  Draft = 'Draft',
  Published = 'Published'
}

export interface IAddForm {
  name: string;
  code: string;
  description: string;
  organizationId: string;
}

export interface IForm extends IAddForm {
  id: string;
  organizationName: string;
  status: FormStatus;
  createdDateUtc: string;
  createdByUserId: string;
  createdByUserFirstName: string;
  createdByUserLastName: string;
  updatedDateUtc: string | null;
  updatedByUserId: string | null;
  updatedByUserFirstName: string | null;
  updatedByUserLastName: string | null;
  attachmentsMetadata: IAttachment[];
  embeddedAttachmentsMetadata: IAttachment[];
}

export interface IAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  url: string;
}
