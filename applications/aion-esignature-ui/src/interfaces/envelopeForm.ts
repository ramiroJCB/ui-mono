import { OptionType } from '@pec/aion-ui-form/types/option';

export interface IAddEnvelopeForm {
  templateId: string;
  documentType: 'custom' | 'template';
  document: IUploadedDocument | null;
  assigneeGroups: OptionType[];
}

export interface IUploadedDocument {
  id: string;
  name: string;
}
