import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Attachment } from '@pec/aion-ui-components/components/Attachment';
import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentStatus';
import { CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { connect } from 'react-redux';
import { downloadEmployeeTrainingRequirementDocument } from '../actions/downloadEmployeeTrainingRequirementDocument';
import { FormApi } from 'final-form';
import { IDocument } from 'interfaces/document';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { IEmployeeTrainingRequirementForm } from 'interfaces/employeeTrainingRequirementForm';
import { RootActions } from '@pec/aion-ui-core/combineActions';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  documents: IDocumentWithStatus[];
  form?: FormApi<IEmployeeTrainingRequirementForm>;
};

const mapDispatchToProps = (dispatch: ThunkDispatch<CommonRootState, null, RootActions>) => ({
  downloadDocument: (document: IDocument) => dispatch(downloadEmployeeTrainingRequirementDocument(document))
});

type Props = OwnProps & ReturnType<typeof mapDispatchToProps>;

class EmployeeTrainingRequirementPendingDocuments extends React.Component<Props> {
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
    const { documents, downloadDocument } = this.props;

    return (
      <Grid item xs={12}>
        {documents.map(document => (
          <Attachment
            key={`${document.fileName}${document.status}${document.id}`}
            attachment={document}
            status={document.status}
            onClick={document.status === AttachmentStatus.Delete ? this.deletePendingUpload : downloadDocument}
            reason={document.causeOfFailure}
          />
        ))}
      </Grid>
    );
  }
}

export const EmployeeTrainingRequirementPendingDocumentsContainer = connect(
  null,
  mapDispatchToProps
)(EmployeeTrainingRequirementPendingDocuments);
