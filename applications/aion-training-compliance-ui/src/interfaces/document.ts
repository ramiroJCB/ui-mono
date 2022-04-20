export interface IDocument {
  id: string;
  isDeleted: boolean;
  fileName: string;
  storagePath?: string;
  mimeType: string;
}
