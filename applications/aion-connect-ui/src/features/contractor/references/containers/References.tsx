import * as React from 'react';
import { connect } from 'react-redux';
import { deleteReference, deleteReferenceSuccess } from 'features/contractor/reference/actions/deleteReference';
import { ReferencesComponent } from '../components/References';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => ({
  ...state.references,
  ...state.profile
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  deleteReference: (referenceId: string) => () => dispatch(deleteReference(organizationId, referenceId)),
  deleteSuccess: (referenceId: string) => () => dispatch(deleteReferenceSuccess(referenceId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class References extends React.Component<Props> {
  render() {
    const { error, references, deleteReference, deleteSuccess, viewAsClient } = this.props;

    return (
      <ReferencesComponent
        error={error}
        references={references}
        deleteReference={deleteReference}
        deleteSuccess={deleteSuccess}
        viewAsClient={viewAsClient}
      />
    );
  }
}

export const ReferencesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(References));
