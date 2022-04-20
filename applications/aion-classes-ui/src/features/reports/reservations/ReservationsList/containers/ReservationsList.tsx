import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchClassReservationAggregates } from '../actions';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { ReservationsListComponent } from '../components/ReservationsList';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { top } from '../actions';

const mapStateToProps = (state: RootState) => state.classReservationAggregates;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchClassReservationAggregates: () => dispatch(fetchClassReservationAggregates(parse(search)))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class ReservationsList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClassReservationAggregates();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchClassReservationAggregates,
      location: { search }
    } = this.props;

    if (search !== prevSearch) {
      fetchClassReservationAggregates();
    }
  }

  handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const {
      history,
      location: { search, state }
    } = this.props;

    history.push({
      search: merge(search, {
        page: (page + 1).toString() // MUI is zero-indexed; API is one-indexed
      }),
      state
    });
  };

  handleChangeSortOrder = (_event: React.SyntheticEvent) => {
    const {
      history,
      location: { search }
    } = this.props;
    const { sortOrder: currentOrder } = parse(search);
    const sortOrder = currentOrder.toString() === 'asc' ? 'desc' : 'asc';

    history.push({
      search: merge(search, {
        sortOrder
      })
    });
  };

  render() {
    const {
      classReservationAggregates,
      error,
      isFetching,
      totalCount,
      location: { search }
    } = this.props;
    const { page, sortOrder } = parse(search);

    return !isFetching && classReservationAggregates ? (
      <ReservationsListComponent
        classReservationAggregates={classReservationAggregates}
        isFetching={isFetching}
        error={error}
        total={totalCount}
        rowsPerPage={top}
        handleChangeSortOrder={this.handleChangeSortOrder}
        onChangePage={this.handleChangePage}
        page={page ? parseInt(page.toString(), 10) - 1 : 0} // MUI is zero-indexed; API is one-indexed
        sortOrder={sortOrder as 'asc' | 'desc'}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ReservationsListContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReservationsList));
