export interface IUploadedLogo {
  id: string;
  organizationId: string;
  fileName: string;
  storagePath: string;
  mimeType: string;
  isDeleted: boolean;
}
