import axios, { AxiosError } from 'axios';
import { firstDayOfCurrentMonth, today } from 'helpers/dates';
import { IReservationMetrics } from 'interfaces/reservationMetrics';
import { ParsedUrlQuery } from 'querystring';
import { ReservationStatus } from '@pec/aion-ui-core/interfaces/reservation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchReservationMetricsRequest = () => ({ type: 'FETCH_RESERVATION_METRICS_REQUEST' } as const);

const fetchReservationMetricsSuccess = (payload: IReservationMetrics) =>
  ({
    type: 'FETCH_RESERVATION_METRICS_SUCCESS',
    payload
  } as const);

const fetchReservationMetricsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_RESERVATION_METRICS_FAILURE',
    error
  } as const;
};

export const fetchReservationMetrics = ({
  creators,
  startCreatedDateUtc = firstDayOfCurrentMonth,
  endCreatedDateUtc = today
}: ParsedUrlQuery): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchReservationMetricsRequest());

    const { data } = await axios.get<IReservationMetrics>('/api/v3.01/reservationMetrics', {
      params: {
        createdByUserIds: creators,
        startCreatedDateUtc,
        endCreatedDateUtc,
        status: ReservationStatus.Active
      }
    });

    dispatch(fetchReservationMetricsSuccess(data));
  } catch (error) {
    dispatch(fetchReservationMetricsFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof fetchReservationMetricsRequest>
  | ReturnType<typeof fetchReservationMetricsSuccess>
  | ReturnType<typeof fetchReservationMetricsFailure>;
