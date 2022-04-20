export interface IDocument {
  id: string;
  organizationId: string;
  organizationCompanyNumber: number | null;
  organizationName: string;
  mimeType: string;
  fileName: string;
  fileSize: number;
  createdDateUtc: string;
}
