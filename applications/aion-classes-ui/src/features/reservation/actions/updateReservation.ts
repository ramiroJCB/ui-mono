import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IReservation } from '@pec/aion-ui-core/interfaces/reservation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateReservationRequest = () =>
  ({
    type: 'UPDATE_RESERVATION_REQUEST'
  } as const);

const updateReservationSuccess = (payload: IReservation) =>
  ({
    type: 'UPDATE_RESERVATION_SUCCESS',
    payload
  } as const);

const updateReservationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_RESERVATION_FAILURE',
    error
  } as const;
};

export const updateReservation = ({
  reservedSeatsCount,
  ...values
}: IReservation): ThunkAction<Promise<IReservation>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateReservationRequest());

      const { data } = await axios.put<IReservation>(`/api/v3.00/reservations(${values.id})`, {
        ...values,
        reservedSeatsCount: Number(reservedSeatsCount)
      });

      dispatch(updateReservationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateReservationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateReservationRequest>
  | ReturnType<typeof updateReservationSuccess>
  | ReturnType<typeof updateReservationFailure>;
