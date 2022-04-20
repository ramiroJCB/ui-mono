import * as React from 'react';
import { AccreditationsComponent } from '../components/Accreditations';
import { connect } from 'react-redux';
import {
  deleteAccreditation,
  deleteAccreditationSuccess
} from 'features/contractor/accreditation/actions/deleteAccreditation';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => ({
  ...state.accreditations,
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
  deleteAccreditation: (accreditationId: string) => () =>
    dispatch(deleteAccreditation(organizationId, accreditationId)),
  deleteSuccess: (accreditationId: string) => () => dispatch(deleteAccreditationSuccess(accreditationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Accreditations extends React.Component<Props> {
  render() {
    const { error, accreditations, deleteAccreditation, deleteSuccess, viewAsClient } = this.props;

    return (
      <AccreditationsComponent
        error={error}
        accreditations={accreditations}
        deleteAccreditation={deleteAccreditation}
        deleteSuccess={deleteSuccess}
        viewAsClient={viewAsClient}
      />
    );
  }
}

export const AccreditationsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Accreditations));
