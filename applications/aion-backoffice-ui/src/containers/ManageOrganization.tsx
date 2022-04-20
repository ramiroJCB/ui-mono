import * as React from 'react';
import ManageOrganization from 'components/ManageOrganization';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationFeaturesIfNeeded } from 'actions/organizationFeatures';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { IManageOrganizationForm } from 'interfaces/manageOrganizationForm';
import { IOrganization, OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { updateOrganization } from '@pec/aion-ui-core/actions/updateOrganization';

type OwnProps = {
  match: {
    params: {
      organizationId: string;
    };
  };
};

const mapStateToProps = (state: RootState) => {
  const {
    organization,
    isFetching: isFetchingOrganization,
    fetchError: organizationError,
    updateError
  } = state.organization;
  const {
    organizationFeatures,
    isFetching: isFetchingOrganizationFeatures,
    error: organizationFeaturesError
  } = state.organizationFeatures;

  return {
    organization,
    organizationFeatures,
    fetchError: organizationError || organizationFeaturesError,
    updateError,
    isFetching: isFetchingOrganization || isFetchingOrganizationFeatures
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, ownProps: OwnProps) => ({
  fetchOrganizationIfNeeded: () => {
    const {
      match: {
        params: { organizationId }
      }
    } = ownProps;
    dispatch(fetchOrganizationIfNeeded(organizationId));
  },
  fetchOrganizationFeaturesIfNeeded: () => dispatch(fetchOrganizationFeaturesIfNeeded()),
  updateOrganization: (organization: IOrganization) => dispatch(updateOrganization(organization))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class OrganizationsResultsContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationIfNeeded();
    props.fetchOrganizationFeaturesIfNeeded();
  }

  onSubmit = async ({ features }: IManageOrganizationForm) => {
    const { organization } = this.props;

    if (organization) {
      const newOrganization: IOrganization = {
        ...organization,
        features: Object.keys(features).filter(key => features[key]) as OrganizationFeature[],
        clientFeatures: organization.clientFeatures && [...organization.clientFeatures]
      };

      await this.props.updateOrganization(newOrganization);
    }
  };

  render() {
    const { organization, organizationFeatures, fetchError, updateError, isFetching } = this.props;

    return !isFetching && organization && organizationFeatures ? (
      <ManageOrganization
        organization={organization}
        organizationFeatures={organizationFeatures}
        onSubmit={this.onSubmit}
        updateError={updateError}
      />
    ) : fetchError ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsResultsContainer);
