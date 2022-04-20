import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchContractorOrganizationIfNeeded } from 'features/client/contractorOrganization/actions';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = ({
  contractorOrganization: { isFetching: isFetchingOrganization, organization }
}: RootState) => ({
  isFetchingOrganization,
  organization
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { contractorId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorOrganizationIfNeeded: () => contractorId && dispatch(fetchContractorOrganizationIfNeeded(contractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class SearchContractorsBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContractorOrganizationIfNeeded();
  }

  render() {
    const {
      organization,
      isFetchingOrganization,
      match: {
        params: { organizationId, contractorId }
      },
      location: { search }
    } = this.props;

    const links: IBreadcrumbLink[] = [
      {
        to: { pathname: `/${organizationId}/connect` },
        label: 'Veriforce Connect'
      },
      {
        to: { pathname: `/${organizationId}/connect/search-contractors`, search },
        label: 'Search Contractor Community'
      }
    ];

    if (contractorId && organization && !isFetchingOrganization) {
      links.push({
        to: { pathname: `/${organizationId}/connect/profile/${contractorId}` },
        label: organization.name
      });
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const SearchContractorsBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchContractorsBreadcrumbs)
);
