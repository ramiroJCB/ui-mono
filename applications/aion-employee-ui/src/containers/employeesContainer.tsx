import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTableDataIfNeeded } from '../actions/employees/fetchEmployees';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from '../combineActions';
import { RootState } from '../combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { performToggleAction } from 'actions/allEmplyeesTable/toggleExpandAction';
import Header from 'components/Header';
import { parse, merge } from '@pec/aion-ui-core/helpers/querystring';
import { ParsedUrlQuery } from 'querystring';
import { AllEmployeesLinkTable } from 'components/allEmployeesTableComponent';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { unlinkEmployeesIfNeeded } from 'actions/linkEmployees/requestEmployeeLinking';

const mapStateToProps = ({
  PECEmployees: { employees, count: itemCount, isFetching: isFetchingEmployees, error: employeesError },
  employeeLinking: { isFetching: isFetchingUnlinking },
  employeesTable: { expandedRows, rowsData }
}: RootState) => ({
  isFetchingEmployees,
  isFetchingUnlinking,
  error: employeesError,
  employees,
  itemCount,
  expandedRows,
  rowsData
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchTableData: (params: ParsedUrlQuery) => dispatch(fetchTableDataIfNeeded(params, organizationId, true)),
  toggleRow: (employee: IPECEmployee) => () => dispatch(performToggleAction(employee)),
  requestUnlinking: (PECEmployeeId: string) => dispatch(unlinkEmployeesIfNeeded(PECEmployeeId))
});

type State = {
  search: string;
  isModalOpen: boolean;
  PECId: string;
};

type RouteParams = {
  organizationId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  RouteParams;

export class Employees extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const params = parse(props.location.search);
    props.fetchTableData(params);
    this.state = {
      search: (params.PECSearch as string) || '',
      isModalOpen: false,
      PECId: ''
    };
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search },
      fetchTableData
    } = this.props;
    if (search !== prevSearch) {
      fetchTableData(parse(search));
    }
  }

  unlinkingHandler = (PECId: string) => () => {
    this.setState({ isModalOpen: true, PECId });
  };

  handleLink = () => {
    const { PECId } = this.state;
    const {
      requestUnlinking,
      fetchTableData,
      location: { search }
    } = this.props;
    return async () => {
      if (PECId !== '') {
        try {
          await requestUnlinking(PECId);
          fetchTableData(parse(search));
        } finally {
          this.setState({ isModalOpen: false, PECId: '' });
        }
      }
    };
  };

  cancelLinking = () => {
    this.setState({ isModalOpen: false, PECId: '' });
  };

  handleSearch = (val: string) => {
    const {
      location: { search },
      history
    } = this.props;
    history.push(merge(search, { PECSearch: val, PECPageNumber: '' }));
  };

  handlePageChange = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => {
    const {
      location: { search },
      history
    } = this.props;
    history.push(merge(search, { PECPageNumber: `${page}` }));
  };

  handleOrderChange = (id: string) => () => {
    const {
      location: { search },
      history
    } = this.props;
    const { PECOrderBy: orderBy, PECOrder: order } = parse(search);
    const newOrder = {
      PECOrderBy: orderBy === id && order === 'asc' ? '' : id,
      PECOrder: orderBy === id && order === 'desc' ? 'asc' : 'desc'
    };
    history.push(merge(search, newOrder));
  };

  handleSearchChange = (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    evt.persist();
    this.setState({ search: evt.target.value || '' });
  };

  render() {
    const {
      employees,
      isFetchingEmployees,
      error,
      toggleRow,
      expandedRows,
      match: {
        params: { organizationId },
        path
      },
      location: { search: URLSearch },
      itemCount,
      rowsData,
      isFetchingUnlinking
    } = this.props;
    const { search } = this.state;
    const params = parse(URLSearch);
    return (
      <React.Fragment>
        <Header organizationId={organizationId} path={path} />
        {!!error ? (
          <Error />
        ) : isFetchingEmployees ? (
          <Loading />
        ) : (
          <React.Fragment>
            {isFetchingEmployees ? (
              <Loading />
            ) : (
              employees && (
                <React.Fragment>
                  <AllEmployeesLinkTable
                    data={employees}
                    expandedRows={expandedRows}
                    toggleExpandedRow={toggleRow}
                    order={params.PECOrder === 'asc' ? 'asc' : 'desc'}
                    orderBy={params.PECOrderBy as string}
                    sortClickHandler={this.handleOrderChange}
                    handleSearch={this.handleSearch}
                    search={search}
                    handleSearchChange={this.handleSearchChange}
                    count={itemCount}
                    handlePageChange={this.handlePageChange}
                    pageNumber={parseInt(params.PECPageNumber as string) || 0}
                    rowsData={rowsData}
                    unlinkingHandler={this.unlinkingHandler}
                    PECId={this.state.PECId}
                    isModalOpen={this.state.isModalOpen}
                    cancelLinking={this.cancelLinking}
                    requestLinking={this.handleLink()}
                    isFetching={isFetchingUnlinking}
                  />
                </React.Fragment>
              )
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export const EmployeesContainer = connect(mapStateToProps, mapDispatchToProps)(Employees);
