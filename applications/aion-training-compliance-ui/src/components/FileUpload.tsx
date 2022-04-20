import React from 'react';
import { FileUpload as FileUploadComponent, maxFileSize } from '@pec/aion-ui-components/components/FileUpload';
import { FileWithPath } from 'react-dropzone';
import { FormApi } from 'final-form';
import { IEmployeeTrainingRequirementForm } from 'interfaces/employeeTrainingRequirementForm';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type OwnProps = {
  form: FormApi<IEmployeeTrainingRequirementForm>;
  error?: boolean;
};

type Props = OwnProps & I18nextProps;

class Component extends React.PureComponent<Props> {
  handleOnDrop = (acceptedFiles: FileWithPath[], rejectedFiles: FileWithPath[]) => {
    const { form, t } = this.props;

    const invalidFiles = rejectedFiles.map(file => ({
      name: file.name || t('trainingCompliance.components.unknown', 'Unknown'),
      reason:
        file.size > maxFileSize
          ? t('trainingCompliance.components.fileIsTooBig', 'File is too big')
          : t('trainingCompliance.components.unsupportedFileType', 'Unsupported file type')
    }));

    const {
      uploadedFiles: { acceptedFiles: prevAcceptedFile, rejectedFiles: prevRejectedFiles }
    } = form.getState().values;

    form.change('uploadedFiles', {
      acceptedFiles: prevAcceptedFile.concat(acceptedFiles),
      rejectedFiles: prevRejectedFiles.concat(invalidFiles)
    });
  };

  render() {
    const { error } = this.props;
    return <FileUploadComponent error={error} handleOnDrop={this.handleOnDrop} />;
  }
}

export const FileUpload = withTranslation()(Component);
