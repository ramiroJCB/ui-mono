export interface IUploadedImage {
  id: string;
  organizationId: string;
  isDeleted: boolean;
  fileName: string;
  storagePath: string;
  thumbnailId: string;
  thumbnailStoragePath: string;
  mimeType: string;
  isCoverPhoto: boolean;
}
