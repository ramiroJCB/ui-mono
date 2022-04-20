import * as React from 'react';
import { addDocument, addDocumentReset } from 'features/document/actions/addDocument';
import { AddDocumentComponent } from '../components/AddDocument';
import { connect } from 'react-redux';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  safetyProgramRequirementId: string;
  questionAnswerId: string;
};

const mapStateToProps = (state: RootState) => state.document;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  addDocument: (file: File, newFileName?: string) => dispatch(addDocument(file, newFileName)),
  addDocumentReset: () => dispatch(addDocumentReset())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Component extends React.Component<Props> {
  handleUpload = async (file: File, newFileName?: string) => {
    const {
      history,
      match: {
        params: { organizationId, safetyProgramRequirementId, questionAnswerId }
      }
    } = this.props;

    try {
      const result = await this.props.addDocument(file, newFileName);

      if (result) {
        history.push(
          `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/answers/${questionAnswerId}/references/add/${result.id}`
        );
      }
    } catch {}
  };

  handleCancelUpload = () => {
    this.props.source?.cancel();
  };

  handleReset = () => {
    this.props.addDocumentReset();
  };

  componentWillUnmount() {
    this.handleCancelUpload();
  }

  render() {
    const { source, progress, error } = this.props;

    return (
      <AddDocumentComponent
        handleUpload={this.handleUpload}
        handleCancelUpload={this.handleCancelUpload}
        handleReset={this.handleReset}
        isUploading={!!source}
        progress={progress}
        error={error}
      />
    );
  }
}

export const AddDocumentContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
