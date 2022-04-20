import * as React from 'react';
import { connect } from 'react-redux';
import {
  deleteOfficeLocation,
  deleteOfficeLocationSuccess
} from 'features/contractor/officeLocation/actions/deleteOfficeLocation';
import { OfficeLocationsComponent } from '../components/OfficeLocations';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => ({
  ...state.officeLocations,
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
  deleteOfficeLocation: (officeLocationId: string) => () =>
    dispatch(deleteOfficeLocation(organizationId, officeLocationId)),
  deleteSuccess: (officeLocationId: string) => () => dispatch(deleteOfficeLocationSuccess(officeLocationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class OfficeLocations extends React.Component<Props> {
  render() {
    const { error, officeLocations, deleteOfficeLocation, deleteSuccess, viewAsClient } = this.props;

    return (
      <OfficeLocationsComponent
        error={error}
        officeLocations={officeLocations}
        deleteOfficeLocation={deleteOfficeLocation}
        deleteSuccess={deleteSuccess}
        viewAsClient={viewAsClient}
      />
    );
  }
}

export const OfficeLocationsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(OfficeLocations));
