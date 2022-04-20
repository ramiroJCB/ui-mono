import * as React from 'react';
import { $top, fetchClients } from '../actions/fetchClients';
import { ClientsComponent } from '../components/Clients';
import { connect } from 'react-redux';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

const mapStateToProps = (state: RootState) => state.safetyProgramClients;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchClients: () => {
    const { page = '0', searchTerm = '' } = parse(search);
    dispatch(fetchClients(parseInt(page.toString()), searchTerm.toString()));
  }
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClients();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchClients,
      location: { search }
    } = this.props;

    if (search !== prevSearch) {
      fetchClients();
    }
  }

  handleSearch = (searchTerm: string) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        searchTerm,
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
      clients,
      total,
      isFetching,
      error,
      location: { search }
    } = this.props;
    const { page = '0', searchTerm = '' } = parse(search);

    return (
      <ClientsComponent
        clients={clients}
        total={total}
        isFetching={isFetching}
        error={error}
        searchTerm={searchTerm.toString()}
        handleSearch={this.handleSearch}
        page={parseInt(page.toString())}
        rowsPerPage={$top}
        onChangePage={this.handlePageChange}
      />
    );
  }
}

export const ClientsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
