import * as React from 'react';
import { CertificationsComponent } from '../components/Certifications';
import { connect } from 'react-redux';
import {
  deleteCertification,
  deleteCertificationSuccess
} from 'features/contractor/certification/actions/deleteCertification';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => ({
  ...state.certifications,
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
  deleteCertification: (certificationId: string) => () =>
    dispatch(deleteCertification(organizationId, certificationId)),
  deleteSuccess: (certificationId: string) => () => dispatch(deleteCertificationSuccess(certificationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Certifications extends React.Component<Props> {
  render() {
    const { error, certifications, deleteCertification, deleteSuccess, viewAsClient } = this.props;

    return (
      <CertificationsComponent
        error={error}
        certifications={certifications}
        deleteCertification={deleteCertification}
        deleteSuccess={deleteSuccess}
        viewAsClient={viewAsClient}
      />
    );
  }
}

export const CertificationsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Certifications));
