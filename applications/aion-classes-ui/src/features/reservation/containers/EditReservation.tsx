import * as React from 'react';
import { connect } from 'react-redux';
import { EditReservationComponent } from '../components/EditReservation';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchReservation } from '../../reservation/actions/fetchReservation';
import { fetchTrainingClass } from '../../class/actions';
import { FormApi } from 'final-form';
import { IReservation, ReservationStatus } from '@pec/aion-ui-core/interfaces/reservation';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateReservation } from '../actions/updateReservation';

const { Active, Cancelled } = ReservationStatus;

type RouteParams = {
  classId: string;
  reservationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { isFetching: isFetchingReservation, error: reservationError, reservation } = state.reservation;
  const { isFetching: isFetchingTrainingClass, error: trainingClassError, trainingClass } = state.trainingClass;

  return {
    error: reservationError || trainingClassError,
    isFetching: isFetchingReservation || isFetchingTrainingClass,
    reservation,
    trainingClass
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { classId, reservationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchReservation: () => dispatch(fetchReservation(reservationId)),
  fetchTrainingClass: () => dispatch(fetchTrainingClass(classId)),
  updateReservation: (values: IReservation) => dispatch(updateReservation(values))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchReservation();
    props.fetchTrainingClass();
  }

  handleChangeStatus = (form: FormApi<IReservation>) => (
    _event: React.ChangeEvent<HTMLButtonElement>,
    checked: boolean
  ) => form.change('status', checked ? Active : Cancelled);

  handleSubmit = async (values: IReservation) => {
    const {
      match: {
        params: { classId }
      },
      history
    } = this.props;
    await this.props.updateReservation(values);
    history.push(`/${classId}`);
  };

  render() {
    const { isFetching, error, reservation, trainingClass } = this.props;

    return !isFetching && !error && reservation && trainingClass ? (
      <EditReservationComponent
        initialValues={reservation}
        onSubmit={this.handleSubmit}
        trainingClass={trainingClass}
        handleChangeStatus={this.handleChangeStatus}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const EditReservationContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
