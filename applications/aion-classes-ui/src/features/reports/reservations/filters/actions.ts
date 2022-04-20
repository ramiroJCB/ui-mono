import axios, { AxiosError, AxiosResponse } from 'axios';
import { IReservationsUser } from '@pec/aion-ui-core/interfaces/reservation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

type Payload = {
  creators: IReservationsUser[];
};

const fetchReservationReportFiltersRequest = () =>
  ({
    type: 'FETCH_RESERVATION_REPORT_FILTERS_REQUEST'
  } as const);

const fetchReservationReportFiltersSuccess = (payload: Payload) =>
  ({
    type: 'FETCH_RESERVATION_REPORT_FILTERS_SUCCESS',
    payload
  } as const);

const fetchReservationReportFiltersFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_RESERVATION_REPORT_FILTERS_FAILURE',
    error
  } as const;
};

export const fetchReservationReportFilters = (
  creators: string
): ThunkAction<Promise<Payload>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchReservationReportFiltersRequest());

      const creatorIds = creators ? creators.split(',') : [];
      const formattedCreatorIds = creatorIds.map(c => `'${c}'`); // Backend expects each userId to be wrapped in single-quotes

      const [creatorsResponse] = (await axios.all([
        creators
          ? axios.get('/api/v3.01/reservationAuditUsers', {
              params: {
                auditUserType: 'createdBy',
                $filter: creators ? `(userId in (${formattedCreatorIds}))` : undefined
              }
            })
          : undefined
      ])) as [AxiosResponse<{ value: IReservationsUser[] }> | undefined];

      const filters = {
        creators: creatorsResponse?.data.value || []
      };

      dispatch(fetchReservationReportFiltersSuccess(filters));
      resolve(filters);
    } catch (error) {
      dispatch(fetchReservationReportFiltersFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchReservationReportFiltersRequest>
  | ReturnType<typeof fetchReservationReportFiltersSuccess>
  | ReturnType<typeof fetchReservationReportFiltersFailure>;
