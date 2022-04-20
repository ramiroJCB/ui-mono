import * as React from 'react';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { connect } from 'react-redux';
import { ContractorComponent } from 'components/Contractor';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchContractorIfNeeded } from 'actions/contractor';
import { fetchRankings } from '@pec/aion-ui-core/actions/rankings';
import { IRanking } from '@pec/aion-ui-core/interfaces/ranking';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withTranslation } from 'react-i18next';

import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
  siteId: string;
  contractorId: string;
};

const mapStateToProps = (
  {
    contractor: { contractor, isFetching: isFetchingContractor, error },
    rankings: { rankings, isFetching: isFetchingRankings }
  }: RootState,
  {
    match: {
      params: { organizationId: clientId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  contractor,
  ranking: rankings && rankings.find(({ organization: { id } }: IRanking) => id === clientId),
  isFetching: isFetchingContractor || isFetchingRankings,
  error
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId: clientId, contractorId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractorIfNeeded: () => dispatch(fetchContractorIfNeeded(contractorId)),
  fetchRankings: () => dispatch(fetchRankings(clientId, contractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithWidth &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class Contractor extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchContractorIfNeeded();
    this.props.fetchRankings();
  }

  render() {
    const {
      contractor,
      ranking,
      isFetching,
      error,
      match: {
        params: { organizationId, siteId }
      },
      width,
      t
    } = this.props;

    const children =
      contractor && !isFetching ? (
        <ContractorComponent
          organizationId={organizationId}
          siteId={siteId}
          contractor={contractor}
          ranking={ranking}
        />
      ) : error ? (
        <Error />
      ) : (
        <Loading />
      );

    return isWidthUp('md', width) ? (
      <React.Fragment>{children}</React.Fragment>
    ) : (
      <NavContainer title={t('smart.contractor.contractor', 'Contractor')}>{children}</NavContainer>
    );
  }
}

export const ContractorContainer = withWidth()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Contractor)))
);
