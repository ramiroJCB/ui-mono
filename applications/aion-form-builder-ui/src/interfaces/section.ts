import { IAttachment } from './form';

export interface ISection {
  id: string;
  formId: string;
  name: string;
  sortOrder: number;
  description: string | null;
  embeddedMediaMetadata: IAttachment[];
}
