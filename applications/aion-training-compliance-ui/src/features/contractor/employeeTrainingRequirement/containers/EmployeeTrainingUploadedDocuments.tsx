import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Attachment } from '@pec/aion-ui-components/components/Attachment';
import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentStatus';
import { CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { connect } from 'react-redux';
import { deleteEmployeeTrainingRequirementDocument } from '../actions/deleteEmployeeTrainingRequirementDocument';
import { downloadEmployeeTrainingRequirementDocument } from '../actions/downloadEmployeeTrainingRequirementDocument';
import { FormApi } from 'final-form';
import { IDocument } from 'interfaces/document';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { IEmployeeTrainingRequirementForm } from 'interfaces/employeeTrainingRequirementForm';
import { RootActions } from '@pec/aion-ui-core/combineActions';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeEmployeeId: string;
  employeeTrainingRequirementId: string;
};

type OwnProps = {
  documents: IDocumentWithStatus[];
  form?: FormApi<IEmployeeTrainingRequirementForm>;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<CommonRootState, null, RootActions>,
  {
    match: {
      params: { employeeTrainingRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  downloadDocument: (document: IDocument) => dispatch(downloadEmployeeTrainingRequirementDocument(document)),
  deleteDocument: (id: string) => () =>
    dispatch(deleteEmployeeTrainingRequirementDocument(employeeTrainingRequirementId, id))
});

type Props = OwnProps & ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & I18nextProps;

class EmployeeTrainingRequirementUploadedDocuments extends React.Component<Props> {
  deletePendingUpload = ({ id }: IDocument) => {
    const { form } = this.props;

    if (form) {
      const {
        uploadedFiles: { acceptedFiles, rejectedFiles }
      } = form.getState().values;

      form.change('uploadedFiles', {
        acceptedFiles: acceptedFiles.filter(({ name }, index) => id !== `${name}${index}`),
        rejectedFiles
      });
    }
  };

  render() {
    const { documents, downloadDocument, deleteDocument, t } = this.props;

    return (
      <Grid item xs={12}>
        {documents.map(document => (
          <Attachment
            key={`${document.fileName}${document.status}${document.id}`}
            attachment={document}
            status={document.status}
            onClick={document.status === AttachmentStatus.Delete ? this.deletePendingUpload : downloadDocument}
            reason={document.causeOfFailure}
            asyncAction={deleteDocument(document.id)}
            message={t('trainingCompliance.contractor.employeeTrainingRequirement.deleteDocumentConfirmation', {
              fileName: document.fileName,
              defaultValue: 'Are you sure you want to delete {{fileName}}?'
            })}
          />
        ))}
      </Grid>
    );
  }
}

export const EmployeeTrainingRequirementUploadedDocumentsContainer = withRouter(
  connect(null, mapDispatchToProps)(withTranslation()(EmployeeTrainingRequirementUploadedDocuments))
);
