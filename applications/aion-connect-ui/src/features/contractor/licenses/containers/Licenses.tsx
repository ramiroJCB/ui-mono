import * as React from 'react';
import { connect } from 'react-redux';
import { deleteLicense, deleteLicenseSuccess } from 'features/contractor/license/actions/deleteLicense';
import { LicensesComponent } from '../components/Licenses';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => ({
  ...state.licenses,
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
  deleteLicense: (licenseId: string) => () => dispatch(deleteLicense(organizationId, licenseId)),
  deleteSuccess: (licenseId: string) => () => dispatch(deleteLicenseSuccess(licenseId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Licenses extends React.Component<Props> {
  render() {
    const { error, licenses, deleteLicense, deleteSuccess, viewAsClient } = this.props;

    return (
      <LicensesComponent
        error={error}
        licenses={licenses}
        deleteLicense={deleteLicense}
        deleteSuccess={deleteSuccess}
        viewAsClient={viewAsClient}
      />
    );
  }
}

export const LicensesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Licenses));
