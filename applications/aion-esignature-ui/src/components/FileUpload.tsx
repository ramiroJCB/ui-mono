import React from 'react';
import { FileUpload as FileUploadComponent, maxFileSize } from '@pec/aion-ui-components/components/FileUpload';
import { FileWithPath } from 'react-dropzone';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { useTranslation } from 'react-i18next';

type Props = {
  error?: boolean;
  onFileUpload: (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) => void;
};

export const FileUpload: React.FC<Props> = ({ error, onFileUpload }: Props) => {
  const { t } = useTranslation();

  const handleOnDrop = (acceptedFiles: FileWithPath[], rejectedFiles: FileWithPath[]) => {
    const invalidFiles: InvalidFileUpload[] = rejectedFiles.map(file => ({
      name: file.name || t('eSignature.common.unknown', 'Unknown'),
      reason:
        file.size > maxFileSize
          ? t('eSignature.components.fileIsTooBig', 'File is too big')
          : t('eSignature.components.unsupportedFileType', 'Unsupported file type')
    }));

    onFileUpload(acceptedFiles, invalidFiles);
  };

  return (
    <FileUploadComponent
      allowedFileExtensions={['.doc', '.docx', '.pdf']}
      buttonColor="primary"
      error={error}
      handleOnDrop={handleOnDrop}
    />
  );
};
