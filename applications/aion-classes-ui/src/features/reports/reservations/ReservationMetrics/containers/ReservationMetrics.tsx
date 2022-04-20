import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchReservationMetrics } from '../actions';
import { isEqual } from 'lodash';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { ReservationMetricsComponent } from '../components/ReservationMetrics';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

const mapStateToProps = (state: RootState) => state.reservationMetrics;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchReservationMetrics: () => dispatch(fetchReservationMetrics(parse(search)))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class ReservationMetrics extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchReservationMetrics();
  }

  stripIrrelevantParams = (searchString: string) => {
    const { page, sortOrder, ...searchParams } = parse(searchString);
    return searchParams;
  };

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchReservationMetrics,
      location: { search }
    } = this.props;

    if (search !== prevSearch) {
      // re-fetch reservationMetrics only if something besides page/sortOrder changed
      if (!isEqual(this.stripIrrelevantParams(search), this.stripIrrelevantParams(prevSearch))) {
        fetchReservationMetrics();
      }
    }
  }

  render() {
    const { reservationMetrics, isFetching, error } = this.props;

    return !isFetching && reservationMetrics ? (
      <ReservationMetricsComponent reservationMetrics={reservationMetrics} />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ReservationMetricsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReservationMetrics));
