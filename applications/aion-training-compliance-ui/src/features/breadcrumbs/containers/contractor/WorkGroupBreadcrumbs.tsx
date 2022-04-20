import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchClientsIfNeeded } from '@pec/aion-ui-core/actions/selectClient';
import { fetchWorkGroupContractorIfNeeded } from 'features/contractor/workGroup/actions';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { matchPath, RouteComponentProps, withRouter } from 'react-router-dom';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const { TrainingCompliance } = OrganizationFeature;

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId?: string;
};

const mapStateToProps = ({
  workGroupContractor: { workGroupContractor, isFetching: isFetchingWorkGroupContractor },
  clients: { clients, isFetching: isFetchingClients }
}: RootState) => ({
  isFetchingClients,
  isFetchingWorkGroupContractor,
  workGroupContractor,
  clients
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, workGroupContractorId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientsIfNeeded: () => dispatch(fetchClientsIfNeeded(organizationId, [TrainingCompliance])),
  fetchworkGroupContractorIfNeeded: () =>
    workGroupContractorId && dispatch(fetchWorkGroupContractorIfNeeded(workGroupContractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class WorkGroupContractorBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientsIfNeeded();
    props.fetchworkGroupContractorIfNeeded();
  }

  render() {
    const {
      clients,
      workGroupContractor,
      isFetchingClients,
      isFetchingWorkGroupContractor,
      location: { pathname },
      match: {
        params: { organizationId, clientId, workGroupContractorId }
      },
      t
    } = this.props;

    const links: IBreadcrumbLink[] = [];

    clients && !isFetchingClients && clients.length > 1
      ? links.push(
          {
            to: { pathname: `/${organizationId}/training-compliance/clients` },
            label: t('trainingCompliance.common.selectOperator', 'Select Operator')
          },
          {
            to: { pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups` },
            label: t('trainingCompliance.common.workGroups', 'Work Groups')
          }
        )
      : links.push({
          to: { pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups` },
          label: t('trainingCompliance.common.workGroups', 'Work Groups')
        });

    if (workGroupContractorId && !isFetchingWorkGroupContractor && workGroupContractor) {
      let link = {
        to: {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}`
        },
        label: workGroupContractor.workGroupName
      };

      if (
        matchPath(
          pathname,
          '/:organizationId/training-compliance/clients/:clientId/work-groups/:workGroupContractorId/general-info'
        )
      ) {
        link.to = {
          pathname: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/general-info`
        };
      }

      links.push(link);
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const WorkGroupContractorBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(WorkGroupContractorBreadcrumbs))
);
