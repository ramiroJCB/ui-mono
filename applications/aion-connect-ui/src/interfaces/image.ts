import { IUploadedImage } from './uploadedImage';

export interface IImage {
  id: string;
  fileName: string;
  thumbnail?: Blob;
  fullSize?: Blob;
  uploadProgress?: number;
  error?: RejectedImageFailure;
  metaData?: IUploadedImage;
  retryUpload?: boolean;
  isLoading?: boolean;
  isCoverPhoto?: boolean;
}

export enum RejectedImageFailure {
  NetworkError = 'Network Error',
  FileSize = 'File size is too large'
}
