import axios, { AxiosError } from 'axios';
import { firstDayOfCurrentMonth, today } from 'helpers/dates';
import { IClassReservationAggregate } from 'interfaces/classReservationAggregate';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { ReservationStatus } from '@pec/aion-ui-core/interfaces/reservation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const top = 15;

const { Equals, In, GreaterThanOrEqualTo, LessThanOrEqualTo } = OdataComparator;

const fetchClassReservationAggregatesRequest = () => ({ type: 'FETCH_CLASS_RESERVATION_AGGREGATES_REQUEST' } as const);

const fetchClassReservationAggregatesSuccess = (payload: IClassReservationAggregate[], totalCount: number) =>
  ({
    type: 'FETCH_CLASS_RESERVATION_AGGREGATES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchClassReservationAggregatesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLASS_RESERVATION_AGGREGATES_FAILURE',
    error
  } as const;
};

export const fetchClassReservationAggregates = ({
  page,
  creators,
  startCreatedDateUtc = firstDayOfCurrentMonth,
  endCreatedDateUtc = today,
  sortOrder = 'desc'
}: ParsedUrlQuery): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchClassReservationAggregatesRequest());

    const odataParams = new QueryBuilder()
      .orderBy(`reservationCreatedDateUtc ${sortOrder}`)
      .top(top)
      .skipByPage(page || '1', top)
      .filter(f =>
        f
          .filterBy('reservationStatus', Equals, ReservationStatus.Active)
          .filterBy('reservationCreatedDateUtc', GreaterThanOrEqualTo, startCreatedDateUtc)
          .filterBy('reservationCreatedDateUtc', LessThanOrEqualTo, endCreatedDateUtc)
          .filterBy('createdBy/userId', In, creators)
      )
      .toQueryParam();

    const {
      data: { '@odata.count': totalCount, value }
    } = await axios.get<{ '@odata.count': number; value: IClassReservationAggregate[] }>(
      '/api/v3.01/classReservationAggregates',
      {
        params: odataParams
      }
    );

    dispatch(fetchClassReservationAggregatesSuccess(value, totalCount));
  } catch (error) {
    dispatch(fetchClassReservationAggregatesFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof fetchClassReservationAggregatesRequest>
  | ReturnType<typeof fetchClassReservationAggregatesSuccess>
  | ReturnType<typeof fetchClassReservationAggregatesFailure>;
