import axios, { AxiosError } from 'axios';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { IProgramStatus } from 'interfaces/programStatus';

export const $top = 25;

const { GreaterThanOrEqualTo, LessThanOrEqualTo } = OdataComparator;

type ResponseData = { value: IProgramStatus[]; '@odata.count': number };

const fetchProgramStatusDataRequest = (search: string) =>
  ({
    type: 'FETCH_PROGRAM_STATUS_DATA_REQUEST',
    search
  } as const);

const fetchProgramStatusDataSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_PROGRAM_STATUS_DATA_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchProgramStatusDataFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_PROGRAM_STATUS_DATA_FAILURE',
    error
  } as const;
};

export const fetchProgramStatusData = (
  page: string,
  startDate: string,
  endDate: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchProgramStatusDataRequest(page));

      const params = new QueryBuilder()
        .top($top)
        .skip(+page * $top)
        .filter(f =>
          f
            .filterBy('createdDateUtc', GreaterThanOrEqualTo, new Date(startDate).toISOString())
            .filterBy('createdDateUtc', LessThanOrEqualTo, new Date(endDate).toISOString())
        )
        .toQueryParam();

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramStatusData', {
        params
      });

      dispatch(fetchProgramStatusDataSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchProgramStatusDataFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchProgramStatusDataRequest>
  | ReturnType<typeof fetchProgramStatusDataSuccess>
  | ReturnType<typeof fetchProgramStatusDataFailure>;
