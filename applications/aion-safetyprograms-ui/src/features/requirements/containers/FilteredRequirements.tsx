import * as React from 'react';
import {
  $top,
  fetchClientRequirements,
  fetchFilteredRequirements
} from 'features/requirements/actions/fetchRequirements';
import { ClientRequirementsComponent } from '../components/ClientRequirements';
import { connect } from 'react-redux';
import { EvaluationsRequirementsComponent } from 'features/evaluations/components/Requirements';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId?: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = ({ requirements, userInfo: { userInfo } }: RootState) => ({ requirements, userInfo });

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchFilteredRequirements: () => dispatch(fetchFilteredRequirements(search, organizationId)),
  fetchClientRequirements: () => dispatch(fetchClientRequirements(search, organizationId))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const {
      match: {
        params: { organizationId }
      },
      userInfo
    } = this.props;
    organizationId ? props.fetchClientRequirements() : userInfo && props.fetchFilteredRequirements();
  }

  componentDidUpdate({ location: { search: prevSearch }, userInfo: prevUserInfo }: Props) {
    const {
      fetchFilteredRequirements,
      fetchClientRequirements,
      location: { search },
      match: {
        params: { organizationId }
      },
      userInfo
    } = this.props;

    if (search !== prevSearch || (prevUserInfo === null && userInfo !== null)) {
      organizationId ? fetchClientRequirements() : fetchFilteredRequirements();
    }
  }

  handleHeaderClick = (orderby: string) => () => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        orderby,
        page: '0'
      })
    });
  };

  handlePageChange = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        page: page.toString()
      })
    });
  };

  render() {
    const {
      match: {
        params: { organizationId }
      },
      location: { search }
    } = this.props;
    const { requirements, clientRequirements, total, isFetching, error } = this.props.requirements;
    const {
      orderby = 'lastContractorActivityDateUtc desc',
      page = '0',
      clients,
      contractors,
      safetyPrograms,
      statuses,
      overrideStatuses,
      hasUnreadContractorComments
    } = parse(search);

    const isFiltered = Boolean(
      clients || contractors || safetyPrograms || statuses || hasUnreadContractorComments || overrideStatuses
    );

    return organizationId ? (
      <ClientRequirementsComponent
        organizationId={organizationId}
        requirements={clientRequirements}
        total={total}
        isFetching={isFetching}
        error={error}
        handleHeaderClick={this.handleHeaderClick}
        page={parseInt(page.toString())}
        rowsPerPage={$top}
        onChangePage={this.handlePageChange}
        isFiltered={isFiltered}
        orderby={orderby.toString()}
      />
    ) : (
      <EvaluationsRequirementsComponent
        requirements={requirements}
        total={total}
        isFetching={isFetching}
        error={error}
        handleHeaderClick={this.handleHeaderClick}
        page={parseInt(page.toString())}
        rowsPerPage={$top}
        onChangePage={this.handlePageChange}
        isFiltered={isFiltered}
        orderby={orderby.toString()}
      />
    );
  }
}

export const FilteredRequirementsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
