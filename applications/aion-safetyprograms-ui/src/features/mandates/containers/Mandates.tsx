import * as React from 'react';
import { $top, fetchMandates } from '../actions/fetchMandates';
import { connect } from 'react-redux';
import { fetchClient } from 'features/client/actions/fetchClient';
import { MandatesComponent } from '../components/Mandates';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  clientId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = ({
  safetyProgramClient: { client, isFetching: isFetchingClient, error: clientError },
  mandates: { mandates, isFetching: isFetchingMandates, error: mandatesError, total }
}: RootState) => ({
  client,
  mandates,
  isFetching: isFetchingClient || isFetchingMandates,
  error: clientError || mandatesError,
  total
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { clientId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClient: () => {
    dispatch(fetchClient(clientId));
  },
  fetchMandates: () => {
    const { page = '0' } = parse(search);
    dispatch(fetchMandates(clientId, parseInt(page.toString())));
  }
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClient();
    props.fetchMandates();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchMandates,
      location: { search }
    } = this.props;

    if (search !== prevSearch) {
      fetchMandates();
    }
  }

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
      client,
      mandates,
      total,
      isFetching,
      error,
      location: { search },
      match: {
        params: { clientId }
      }
    } = this.props;
    const { page = '0' } = parse(search);

    return (
      <MandatesComponent
        clientId={clientId}
        client={client}
        mandates={mandates}
        total={total}
        isFetching={isFetching}
        error={error}
        page={parseInt(page.toString())}
        rowsPerPage={$top}
        onChangePage={this.handlePageChange}
      />
    );
  }
}

export const MandatesContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
