import * as React from 'react';
import { $top } from 'features/requirements/actions/fetchRequirements';
import { connect } from 'react-redux';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { ExceptionRequestsComponent } from 'features/exceptionRequests/components/ExceptionRequests';
import { fetchClientRequirementOverridesByClientId } from 'features/requirementClientOverrides/fetchRequirementClientOverrides';

type RouteParams = {
  organizationId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = ({ clientRequirementOverrides, userInfo: { userInfo } }: RootState) => ({
  clientRequirementOverrides,
  userInfo
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    },
    location: { search }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientRequirementOverridesByClientId: () => {
    dispatch(fetchClientRequirementOverridesByClientId(search, organizationId));
  }
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const { userInfo } = this.props;
    userInfo && props.fetchClientRequirementOverridesByClientId();
  }

  componentDidUpdate({ location: { search: prevSearch }, userInfo: prevUserInfo }: Props) {
    const {
      fetchClientRequirementOverridesByClientId,
      location: { search },
      userInfo
    } = this.props;

    if (search !== prevSearch || (prevUserInfo === null && userInfo !== null)) {
      fetchClientRequirementOverridesByClientId();
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
    const { clientRequirementOverrides, total, isFetching, error } = this.props.clientRequirementOverrides;
    const { orderby = 'requestUpdatedDateUtc desc', page = '0', contractors, safetyPrograms } = parse(search);

    const isFiltered = Boolean(contractors || safetyPrograms);

    return organizationId ? (
      <ExceptionRequestsComponent
        isFiltered={isFiltered}
        organizationId={organizationId}
        requirementOverrides={clientRequirementOverrides}
        total={total}
        isFetching={isFetching}
        error={error}
        handleHeaderClick={this.handleHeaderClick}
        page={parseInt(page.toString())}
        rowsPerPage={$top}
        onChangePage={this.handlePageChange}
        orderby={orderby.toString()}
      />
    ) : null;
  }
}

export const ExceptionRequestsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
