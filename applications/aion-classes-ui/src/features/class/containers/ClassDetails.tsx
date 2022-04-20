import * as React from 'react';
import { ClassDetailsComponent } from '../components/ClassDetails';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchReservations } from '../../reservations/actions';
import { fetchTrainingClass } from '../actions';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  classId: string;
};

const mapStateToProps = (state: RootState) => {
  const { isFetching: isFetchingTrainingClass, error: trainingClassError, trainingClass } = state.trainingClass;
  const { isFetching: isFetchingReservations, error: reservationsError, reservations } = state.reservations;

  return {
    isFetching: isFetchingReservations || isFetchingTrainingClass,
    error: reservationsError || trainingClassError,
    reservations,
    trainingClass
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { classId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchTrainingClass: () => dispatch(fetchTrainingClass(classId)),
  fetchReservations: () => dispatch(fetchReservations(classId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ClassDetails extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchTrainingClass();
    props.fetchReservations();
  }

  render() {
    const {
      isFetching,
      error,
      reservations,
      trainingClass,
      location: { state },
      match: {
        params: { classId }
      }
    } = this.props;

    return reservations && trainingClass && !isFetching ? (
      <ClassDetailsComponent
        classId={classId}
        isFetching={isFetching}
        error={error}
        reservations={reservations}
        trainingClass={trainingClass}
        state={state}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ClassDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(ClassDetails);
