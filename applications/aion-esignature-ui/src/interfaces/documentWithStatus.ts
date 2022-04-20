import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentStatus';
import { IDocument } from './document';

export interface IDocumentWithStatus extends IDocument {
  status: AttachmentStatus;
  causeOfFailure?: string;
}
