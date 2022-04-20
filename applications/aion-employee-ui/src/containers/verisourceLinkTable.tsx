import * as React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { RootState } from '../combineReducers';
import { fetchTableDataIfNeeded } from 'actions/employees/fetchVerisourceEmployees';
import { ThunkDispatch } from 'redux-thunk';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Grid } from '@material-ui/core';
import { parse, merge } from '@pec/aion-ui-core/helpers/querystring';
import { ParsedUrlQuery } from 'querystring';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';
import { startEmployeesLinking } from 'actions/linkEmployees/startLinking';
import { RootActions } from 'combineActions';
import { VerisourceLinkTable } from 'components/VerisourceLinkTableComponent';

type OwnProps = {
  URLSearch: string;
  history: History;
  setModal: (state: boolean) => void;
};

const mapStateToProps = ({ PECEmployees: { employees }, VerisourceEmployees }: RootState, { URLSearch }: OwnProps) => {
  const params = parse(URLSearch);
  return {
    ...VerisourceEmployees,
    selectedPECEmployee: employees.find(({ id }) => id === (params.ItemSelected as string))
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { setModal }: OwnProps) => ({
  fetchTableData: (params: ParsedUrlQuery) => dispatch(fetchTableDataIfNeeded(params)),
  linkEmployee: (PECId: string, verisourceEmployee: IVerisourceEmployee) => () => {
    dispatch(startEmployeesLinking(PECId, verisourceEmployee));
    setModal(true);
  }
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

type State = {
  search: string;
};

class VerisourceLinkTableComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const params = parse(props.URLSearch);
    props.fetchTableData(params);
    this.state = {
      search: (params.VerisourceSearch as string) || ''
    };
  }

  componentDidUpdate({ URLSearch: prevURLSearch }: { URLSearch: string }) {
    const { URLSearch, fetchTableData } = this.props;
    if (URLSearch !== prevURLSearch) {
      const newParams = parse(URLSearch);
      const oldParams = parse(prevURLSearch);
      Object.keys(newParams).some(k => k.includes('Verisource') && newParams[k] !== oldParams[k]) &&
        fetchTableData(parse(URLSearch));

      if (newParams.VerisourceSearch !== oldParams.VerisourceSearch) {
        this.setState({
          search: (newParams.VerisourceSearch as string) || ''
        });
      }
    }
  }

  handleSearch = (val: string) => {
    const { URLSearch, history } = this.props;
    history.push(merge(URLSearch, { VerisourceSearch: val, VerisourcePageNumber: '' }));
  };

  handlePageChange = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => {
    const { URLSearch, history } = this.props;
    history.push(merge(URLSearch, { VerisourcePageNumber: `${page}` }));
  };

  handleOrderChange = (id: string) => () => {
    const { URLSearch, history } = this.props;
    const { VerisourceOrderBy, VerisourceOrder } = parse(URLSearch);
    const newOrder = {
      VerisourceOrderBy: VerisourceOrderBy === id && VerisourceOrder === 'asc' ? '' : id,
      VerisourceOrder: VerisourceOrderBy === id && VerisourceOrder === 'desc' ? 'asc' : 'desc'
    };
    history.push(merge(URLSearch, newOrder));
  };

  handleSearchChange = (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    evt.persist();
    this.setState({ search: evt.target.value || '' });
  };

  render() {
    const { isFetching, error, URLSearch, employees, count, linkEmployee, selectedPECEmployee } = this.props;
    const { search } = this.state;
    const params = parse(URLSearch);
    return (
      <React.Fragment>
        {!!error ? (
          <Error />
        ) : isFetching ? (
          <Loading />
        ) : (
          <Grid item container xs={12} md={6}>
            <VerisourceLinkTable
              data={employees}
              orderBy={params.VerisourceOrderBy as string}
              order={params.VerisourceOrder === 'asc' ? 'asc' : 'desc'}
              handleSearch={this.handleSearch}
              search={search}
              handleSearchChange={this.handleSearchChange}
              sortClickHandler={this.handleOrderChange}
              selectedPECEmployee={selectedPECEmployee}
              count={count}
              handlePageChange={this.handlePageChange}
              pageNumber={parseInt(params.VerisourcePageNumber as string) || 0}
              linkEmployees={linkEmployee}
            />
          </Grid>
        )}
      </React.Fragment>
    );
  }
}

export const VerisourceLinkTableContainer = connect(mapStateToProps, mapDispatchToProps)(VerisourceLinkTableComponent);
