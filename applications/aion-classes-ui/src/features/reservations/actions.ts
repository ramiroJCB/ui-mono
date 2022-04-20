import axios, { AxiosError } from 'axios';
import { IReservation } from '@pec/aion-ui-core/interfaces/reservation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchReservationsRequest = () => ({ type: 'FETCH_RESERVATIONS_REQUEST' } as const);

const fetchReservationsSuccess = (payload: IReservation[], totalCount: number) =>
  ({
    type: 'FETCH_RESERVATIONS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchReservationsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_RESERVATIONS_FAILURE',
    error
  } as const;
};

export const fetchReservations = (classId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchReservationsRequest());

    const params = {
      $orderBy: `createdDateUtc desc`,
      $filter: `classId eq ${classId}`
    };

    const {
      data: { '@odata.count': totalCount, value }
    } = await axios.get<{ '@odata.count': number; value: IReservation[] }>('/api/v3.00/reservations', {
      params
    });

    dispatch(fetchReservationsSuccess(value, totalCount));
  } catch (error) {
    dispatch(fetchReservationsFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof fetchReservationsRequest>
  | ReturnType<typeof fetchReservationsSuccess>
  | ReturnType<typeof fetchReservationsFailure>;
