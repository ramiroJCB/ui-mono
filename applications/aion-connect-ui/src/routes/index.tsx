import * as React from 'react';
import { connect } from 'react-redux';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { Profile as ContractorProfile } from 'features/contractor/profile/components/Profile';
import { Profile as ClientProfile } from 'features/client/profile/components/Profile';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { SearchContractorsComponent } from 'features/client/searchContractors/components/SearchContractors';
import { ThunkDispatch } from 'redux-thunk';
// import { RecommendationsComponent } from 'features/client/recommendations/components/Recommendations';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { organization } = state.organization;
  const { gmapsIsLoaded } = state.serverTokens;

  return {
    organization,
    gmapsIsLoaded
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Routes extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationIfNeeded();
  }

  render() {
    const {
      match: {
        params: { organizationId }
      },
      gmapsIsLoaded,
      organization
    } = this.props;
    const { Client, Subscriber } = OrganizationFeature;

    return gmapsIsLoaded && organization && organization.features.includes(Client) ? (
      <Switch>
        {/* <Route path="/:organizationId/connect/recommendations" component={RecommendationsComponent} /> */}
        <Route path="/:organizationId/connect/search-contractors" component={SearchContractorsComponent} />
        <Route path="/:organizationId/connect/profile/:contractorId" component={ClientProfile} />
        <Redirect exact from="/:organizationId/connect" to={`/${organizationId}/connect/search-contractors`} />
      </Switch>
    ) : organization && organization.features.includes(Subscriber) ? (
      <Switch>
        <Route path="/:organizationId/connect/profile" component={ContractorProfile} />
        <Redirect exact from="/:organizationId/connect" to={`/${organizationId}/connect/profile`} />
      </Switch>
    ) : null;
  }
}

export const RoutesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
