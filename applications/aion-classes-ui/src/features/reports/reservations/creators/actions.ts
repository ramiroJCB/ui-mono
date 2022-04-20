import axios, { AxiosError } from 'axios';
import { IReservationsUser } from '@pec/aion-ui-core/interfaces/reservation';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchCreatorsRequest = () =>
  ({
    type: 'FETCH_CREATORS_REQUEST'
  } as const);

const fetchCreatorsSuccess = (data: OdataResponse<IReservationsUser[]>) =>
  ({
    type: 'FETCH_CREATORS_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchCreatorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CREATORS_FAILURE',
    error
  } as const;
};

export const fetchCreators = (
  searchTerm: string
): ThunkAction<Promise<OdataResponse<IReservationsUser[]>>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchCreatorsRequest());

      const $top = 25;

      const { data } = await axios.get<OdataResponse<IReservationsUser[]>>('/api/v3.01/reservationAuditUsers', {
        params: {
          auditUserType: 'createdBy',
          $top,
          $orderby: 'fullName',
          $filter: `contains(tolower(fullName),'${searchTerm.toLowerCase()}')`
        }
      });

      dispatch(fetchCreatorsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchCreatorsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchCreatorsRequest>
  | ReturnType<typeof fetchCreatorsSuccess>
  | ReturnType<typeof fetchCreatorsFailure>;
