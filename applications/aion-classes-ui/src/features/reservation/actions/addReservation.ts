import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAddReservation, IReservation } from '@pec/aion-ui-core/interfaces/reservation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addReservationRequest = () =>
  ({
    type: 'ADD_RESERVATION_REQUEST'
  } as const);

const addReservationSuccess = (payload: IReservation) =>
  ({
    type: 'ADD_RESERVATION_SUCCESS',
    payload
  } as const);

const addReservationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_RESERVATION_FAILURE',
    error
  } as const;
};

export const addReservation = ({
  reservedSeatsCount,
  ...values
}: IAddReservation): ThunkAction<Promise<IAddReservation>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addReservationRequest());

      const { data } = await axios.post<IReservation>('/api/v3.00/reservations', {
        ...values,
        reservedSeatsCount: Number(reservedSeatsCount)
      });

      dispatch(addReservationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addReservationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addReservationRequest>
  | ReturnType<typeof addReservationSuccess>
  | ReturnType<typeof addReservationFailure>;
