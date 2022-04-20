import { IDocument } from './document';
import { PercentCrop } from 'react-image-crop';

export interface IReference extends IAddReference {
  id: string;
  createdDateUtc: string;
  documentMetadata: IDocument;
}

export interface IAddReference {
  questionAnswerId: string;
  pageNumber: number;
  selectionLocation: PercentCrop;
  documentMetadataId: string;
}
