import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { Redirect } from 'react-router';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  match: {
    params: {
      organizationId: string;
    };
  };
};

const mapStateToProps = (state: RootState) => state.organization;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: OwnProps
) => ({
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class RedirectByOrganizationFeature extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationIfNeeded();
  }

  render() {
    const {
      organization,
      isFetching,
      fetchError,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return organization && !isFetching ? (
      <Redirect
        to={
          organization.features.includes(OrganizationFeature.Client)
            ? `/${organizationId}/reporting/regional/periods`
            : `/${organizationId}/reporting/regional/clients`
        }
      />
    ) : fetchError ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const RedirectByOrganizationFeatureContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RedirectByOrganizationFeature);
