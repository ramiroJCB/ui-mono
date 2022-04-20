import * as React from 'react';
import { addReservation } from '../actions/addReservation';
import { AddReservationComponent } from '../components/AddReservation';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTrainingClass } from '../../class/actions';
import { IAddReservation, ReservationSource, ReservationStatus } from '@pec/aion-ui-core/interfaces/reservation';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

const { InsideSales } = ReservationSource;
const { Active } = ReservationStatus;

type RouteParams = {
  classId: string;
};

const mapStateToProps = (state: RootState) => state.trainingClass;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { classId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addReservation: (values: IAddReservation) => dispatch(addReservation(values)),
  fetchTrainingClass: () => dispatch(fetchTrainingClass(classId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchTrainingClass();
  }

  handleSubmit = async (values: IAddReservation) => {
    const {
      match: {
        params: { classId }
      },
      history
    } = this.props;
    await this.props.addReservation(values);
    history.push(`/${classId}`);
  };

  render() {
    const {
      isFetching,
      error,
      match: {
        params: { classId }
      },
      trainingClass
    } = this.props;

    const initialValues: IAddReservation = {
      classId: classId,
      comment: null,
      contact: {
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNumber: ''
      },
      organizationId: '00000000-0000-0000-0000-000000000000',
      organizationName: '',
      reservedSeatsCount: 1,
      source: InsideSales,
      status: Active
    };

    return !isFetching && !error && trainingClass ? (
      <AddReservationComponent
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        trainingClass={trainingClass}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const AddReservationContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
