import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { fetchOrganizationLinkIfNeeded } from '@pec/aion-ui-core/actions/fetchOrganizationLink';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { getOptionsIfNeeded, setOption } from '@pec/aion-ui-core/actions/options';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { VeriforceIntegrationComponent } from 'components/Dashboard/VeriforceIntegration';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = ({
  options: { dismissOrganizationLink },
  organization: { organization },
  organizationLink: { organizationLink },
  userInfo: { userInfo }
}: RootState) => ({
  promptForOrganizationLink:
    organization &&
    organization.features.includes(OrganizationFeature.LinkVeriforceCompany) &&
    organizationLink === undefined &&
    !dismissOrganizationLink &&
    hasPermission(userInfo, ActivityAction.Write, ActivityResourceName.VeriforceOrganizationLinks, [
      {
        type: UserInfoActivitiesType.Organization,
        id: organization && organization.id
      }
    ])
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  dismissOrganizationLink: () => dispatch(setOption('dismissOrganizationLink', true)),
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(organizationId)),
  fetchOrganizationLinkIfNeeded: () => dispatch(fetchOrganizationLinkIfNeeded(organizationId)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded()),
  getOptionsIfNeeded: () => dispatch(getOptionsIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class VeriforceIntegration extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationIfNeeded();
    props.fetchOrganizationLinkIfNeeded();
    props.fetchUserInfoIfNeeded();
    props.getOptionsIfNeeded();
  }

  render() {
    const { dismissOrganizationLink, promptForOrganizationLink } = this.props;

    return promptForOrganizationLink ? <VeriforceIntegrationComponent onDismiss={dismissOrganizationLink} /> : null;
  }
}

export const VeriforceIntegrationContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VeriforceIntegration)
);
