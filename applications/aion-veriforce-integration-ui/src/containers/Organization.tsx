import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { addOrganizationLink } from '@pec/aion-ui-core/actions/addOrganizationLink';
import { AddOrganizationLinkComponent } from 'components/AddOrganizationLink';
import { connect } from 'react-redux';
import { deleteOrganizationLink } from '@pec/aion-ui-core/actions/deleteOrganizationLink';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationIfNeeded, refetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { fetchOrganizationLinkIfNeeded } from '@pec/aion-ui-core/actions/fetchOrganizationLink';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { fetchVeriforceOrganizationIfNeeded, resetVeriforceOrganization } from 'actions/fetchVeriforceOrganization';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { OrganizationLinkComponent } from 'components/OrganizationLink';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { VeriforceLoginComponent } from 'components/VeriforceLogin';

type RouteParams = {
  pecOrganizationId: string;
};

const mapStateToProps = (
  {
    userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
    organization: { organization, isFetching: isFetchingOrganization, fetchError: organizationError },
    organizationLink: { organizationLink, isFetching: isFetchingOrganizationLink, error: organizationLinkError },
    veriforceOrganization: {
      veriforceOrganization,
      username,
      password,
      isFetching: isFetchingVeriforceOrganization,
      error: veriforceOrganizationError
    }
  }: RootState,
  {
    match: {
      params: { pecOrganizationId }
    }
  }: RouteComponentProps<RouteParams>
) => {
  const organizationLinkErrorResponse = organizationLinkError && organizationLinkError.response;

  const existingLinkFieldName = 'EXISTING_VERIFORCE_ORGANIZATION_LINK';
  const existingLinkField =
    organizationLinkErrorResponse &&
    organizationLinkErrorResponse.data.fields &&
    organizationLinkErrorResponse.data.fields[existingLinkFieldName] &&
    organizationLinkErrorResponse.data.fields[existingLinkFieldName][0];

  let existingLinkPecOrganizationName;

  if (existingLinkField) {
    try {
      existingLinkPecOrganizationName = JSON.parse(existingLinkField).PecOrganizationName;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    organization,
    organizationLink,
    veriforceOrganization,
    username,
    password,
    isFetching:
      isFetchingUserInfo || isFetchingOrganization || isFetchingOrganizationLink || isFetchingVeriforceOrganization,
    error: userInfoError || organizationError || organizationLinkError,
    organizationLinkError,
    veriforceOrganizationError,
    hasAuthorizationError: Boolean(organizationLinkErrorResponse && organizationLinkErrorResponse.status === 401),
    hasOrganizationTypeError: Boolean(
      organizationLinkErrorResponse &&
        organizationLinkErrorResponse.data.key === 'PEC_AND_VERIFORCE_ORGANIZATION_TYPE_MISMATCH'
    ),
    existingLinkPecOrganizationName,
    hasPermission: Boolean(
      organization &&
        organization.features.includes(OrganizationFeature.LinkVeriforceCompany) &&
        !(
          veriforceOrganizationError &&
          veriforceOrganizationError.response &&
          veriforceOrganizationError.response.status === 400
        ) &&
        hasPermission(userInfo, ActivityAction.Write, ActivityResourceName.VeriforceOrganizationLinks, [
          {
            type: UserInfoActivitiesType.Organization,
            id: pecOrganizationId
          }
        ])
    )
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { pecOrganizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded()),
  addOrganizationLink: (username: string, password: string) =>
    dispatch(addOrganizationLink(pecOrganizationId, username, password)),
  deleteOrganizationLink: (organizationLinkId: string) => dispatch(deleteOrganizationLink(organizationLinkId)), // resetVeriforceOrganization
  fetchVeriforceOrganizationIfNeeded: (username: string, password: string) =>
    dispatch(fetchVeriforceOrganizationIfNeeded(username, password)),
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(pecOrganizationId)),
  refetchOrganizationIfNeeded: () => dispatch(refetchOrganizationIfNeeded(pecOrganizationId)),
  fetchOrganizationLinkIfNeeded: () => dispatch(fetchOrganizationLinkIfNeeded(pecOrganizationId)),
  resetVeriforceOrganization: () => dispatch(resetVeriforceOrganization())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Organization extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchUserInfoIfNeeded();
    props.fetchOrganizationIfNeeded();
    props.fetchOrganizationLinkIfNeeded();
  }

  componentWillUnmount() {
    this.props.resetVeriforceOrganization();
  }

  handleUnlinkOrganizations = async () => {
    const {
      organizationLink,
      deleteOrganizationLink,
      resetVeriforceOrganization,
      refetchOrganizationIfNeeded
    } = this.props;

    if (organizationLink) {
      await deleteOrganizationLink(organizationLink.id);
      refetchOrganizationIfNeeded();
      resetVeriforceOrganization();
    }
  };

  handleLinkOrganizations = async () => {
    const { username, password, addOrganizationLink, refetchOrganizationIfNeeded } = this.props;
    if (username && password) {
      await addOrganizationLink(username, password);
      refetchOrganizationIfNeeded();
    }
  };

  handleBackToLogin = () => {
    this.props.resetVeriforceOrganization();
  };

  handleSubmitVeriforceLogin = (username: string, password: string) => {
    if (username && password) {
      this.props.fetchVeriforceOrganizationIfNeeded(username, password);
    }
  };

  render() {
    const {
      hasPermission,
      organization,
      organizationLink,
      veriforceOrganization,
      username,
      password,
      isFetching,
      error,
      veriforceOrganizationError,
      hasAuthorizationError,
      hasOrganizationTypeError,
      existingLinkPecOrganizationName
    } = this.props;

    return !isFetching &&
      organization &&
      organizationLink !== null &&
      (!error || hasAuthorizationError || hasOrganizationTypeError || existingLinkPecOrganizationName) ? (
      organizationLink ? (
        <OrganizationLinkComponent
          organizationLink={organizationLink}
          onClickUnlinkOrganizations={this.handleUnlinkOrganizations}
        />
      ) : organization && veriforceOrganization ? (
        <AddOrganizationLinkComponent
          pecOrganizationName={organization.name}
          veriforceOrganizationName={veriforceOrganization.veriforceOrganizationName}
          onClickLinkOrganizations={this.handleLinkOrganizations}
          onClickBackToLogin={this.handleBackToLogin}
          hasAuthorizationError={hasAuthorizationError}
          hasOrganizationTypeError={hasOrganizationTypeError}
          existingLinkPecOrganizationName={existingLinkPecOrganizationName}
        />
      ) : (
        <VeriforceLoginComponent
          hasPermission={hasPermission}
          pecOrganizationName={organization.name}
          onSubmit={this.handleSubmitVeriforceLogin}
          hasError={Boolean(veriforceOrganizationError)}
          username={username || ''}
          password={password || ''}
        />
      )
    ) : !isFetching && error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const OrganizationContainer = connect(mapStateToProps, mapDispatchToProps)(Organization);
