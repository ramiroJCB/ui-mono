import axios, { AxiosError } from 'axios';
import { IReservation } from '@pec/aion-ui-core/interfaces/reservation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchReservationRequest = () =>
  ({
    type: 'FETCH_RESERVATION_REQUEST'
  } as const);

const fetchReservationSuccess = (payload: IReservation) =>
  ({
    type: 'FETCH_RESERVATION_SUCCESS',
    payload
  } as const);

const fetchReservationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_RESERVATION_FAILURE',
    error
  } as const;
};

export const fetchReservation = (
  id: string
): ThunkAction<Promise<IReservation>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchReservationRequest());

      const params = { $filter: `id eq ${id}` };

      const {
        data: { value }
      } = await axios.get<{ value: IReservation }>('/api/v3.00/reservations', {
        params
      });

      dispatch(fetchReservationSuccess(value[0]));
      resolve(value[0]);
    } catch (error) {
      dispatch(fetchReservationFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchReservationRequest>
  | ReturnType<typeof fetchReservationSuccess>
  | ReturnType<typeof fetchReservationFailure>;
