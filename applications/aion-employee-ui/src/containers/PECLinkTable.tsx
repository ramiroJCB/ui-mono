import * as React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { RootState } from '../combineReducers';
import { fetchTableDataIfNeeded } from 'actions/employees/fetchEmployees';
import { ThunkDispatch } from 'redux-thunk';
import { RootActions } from '@pec/aion-ui-core/combineActions';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Grid } from '@material-ui/core';
import { parse, merge } from '@pec/aion-ui-core/helpers/querystring';
import { ParsedUrlQuery } from 'querystring';
import { PECLinkTable } from '../components/PECLinkTableComponent';
import { fetchTableDataItemSelectedIfNeeded } from '../actions/employees/fetchVerisourceEmployees';
import { IPECEmployee } from 'interfaces/PECEmployee';

const mapStateToProps = ({ PECEmployees }: RootState) => ({
  ...PECEmployees
});

type OwnProps = {
  organizationId: string;
  URLSearch: string;
  history: History;
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { organizationId }: OwnProps) => ({
  fetchTableData: (params: ParsedUrlQuery) => dispatch(fetchTableDataIfNeeded(params, organizationId)),
  fetchTableDataVerisource: (params: ParsedUrlQuery) => dispatch(fetchTableDataItemSelectedIfNeeded(params))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

type State = {
  search: string;
  itemSelected: string;
};

class PECLinkTableComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const params = parse(props.URLSearch);
    this.state = {
      search: (params.PECSearch as string) || '',
      itemSelected: (params.ItemSelected as string) || ''
    };

    props.fetchTableData(params).then(this.handleAddReference);
  }

  handleRowAction = (row: IPECEmployee) => {
    return () => {
      const { URLSearch, history } = this.props;
      history.push(
        merge(URLSearch, {
          ItemSelected: `${row.id}`,
          VerisourceSearch: '',
          VerisourcePageNumber: ''
        })
      );
      this.setState({ itemSelected: row.id });
    };
  };

  handleAddReference = () => {
    const { history, employees, URLSearch } = this.props;
    if (employees.length > 0) {
      history.push(
        merge(URLSearch, {
          ItemSelected: `${employees[0].id}`,
          VerisourceSearch: '',
          VerisourcePageNumber: ''
        })
      );

      this.setState({ itemSelected: employees[0].id });
    } else {
      history.push(
        merge(URLSearch, {
          ItemSelected: ''
        })
      );
      this.setState({ itemSelected: '' });
    }
  };

  componentDidUpdate({ URLSearch: prevURLSearch }: { URLSearch: string }) {
    const { URLSearch, fetchTableData, fetchTableDataVerisource } = this.props;
    if (URLSearch !== prevURLSearch) {
      const newParams = parse(URLSearch);
      const oldParams = parse(prevURLSearch);
      Object.keys(newParams).some(k => k.includes('PEC') && newParams[k] !== oldParams[k]) &&
        fetchTableData(parse(URLSearch)).then(this.handleAddReference);

      if (newParams.ItemSelected !== oldParams.ItemSelected) {
        fetchTableDataVerisource(parse(URLSearch));
      }
    }
  }

  handleSearch = (val: string) => {
    const { URLSearch, history } = this.props;
    history.push(merge(URLSearch, { PECSearch: val, PECPageNumber: '' }));
  };

  handlePageChange = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => {
    const { URLSearch, history } = this.props;
    this.setState({ itemSelected: '' });
    history.push(merge(URLSearch, { PECPageNumber: `${page}` }));
  };

  handleOrderChange = (id: string) => () => {
    const { URLSearch, history } = this.props;
    const { PECOrderBy, PECOrder } = parse(URLSearch);
    const newOrder = {
      PECOrderBy: PECOrderBy === id && PECOrder === 'asc' ? '' : id,
      PECOrder: PECOrderBy === id && PECOrder === 'desc' ? 'asc' : 'desc'
    };
    history.push(merge(URLSearch, newOrder));
  };

  handleSearchChange = (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    evt.persist();
    this.setState({ search: evt.target.value || '' });
  };

  render() {
    const { isFetching, error, URLSearch, employees, count } = this.props;
    const { search, itemSelected } = this.state;
    const params = parse(URLSearch);
    return (
      <React.Fragment>
        {!!error ? (
          <Error />
        ) : isFetching ? (
          <Loading />
        ) : (
          <Grid item container xs={12} md={6}>
            <PECLinkTable
              data={employees}
              order={params.PECOrder === 'asc' ? 'asc' : 'desc'}
              orderBy={params.PECOrderBy as string}
              handleSearch={this.handleSearch}
              search={search}
              handleSearchChange={this.handleSearchChange}
              sortClickHandler={this.handleOrderChange}
              count={count}
              handlePageChange={this.handlePageChange}
              pageNumber={parseInt(params.PECPageNumber as string) || 0}
              itemSelected={itemSelected}
              handleRowAction={this.handleRowAction}
            />
          </Grid>
        )}
      </React.Fragment>
    );
  }
}

export const PECLinkTableContainer = connect(mapStateToProps, mapDispatchToProps)(PECLinkTableComponent);
