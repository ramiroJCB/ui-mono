import axios, { AxiosError } from 'axios';
import { fetchAll } from '@pec/aion-ui-odata/helpers/fetchAll';
import { ISafetyProgram, SafetyProgramStatus } from 'interfaces/safetyProgram';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';

export const $top = 25;

const { Contains, Equals } = OdataComparator;

type ResponseData = { value: ISafetyProgram[]; '@odata.count': number };

const fetchSafetyProgramsRequest = () =>
  ({
    type: 'FETCH_SAFETY_PROGRAMS_REQUEST'
  } as const);

const fetchSafetyProgramsSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_SAFETY_PROGRAMS_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchSafetyProgramsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SAFETY_PROGRAMS_FAILURE',
    error
  } as const;
};

export const fetchSafetyPrograms = (
  page: number,
  searchTerm: string,
  onlyValid?: boolean
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchSafetyProgramsRequest());

      const params = new QueryBuilder()
        .top($top)
        .skip(page * $top)
        .filter(filter => {
          searchTerm && filter.filterBy('title', Contains, searchTerm);
          onlyValid && filter.and(f => f.filterBy('status', Equals, 'Valid'));
          return filter;
        })
        .orderBy('title')
        .toQueryParam();

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyPrograms', {
        params
      });

      dispatch(fetchSafetyProgramsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchSafetyProgramsFailure(error));
      reject(error);
    }
  });

export const fetchAllSafetyPrograms = (
  searchTerm: string,
  orderBy: string | string[],
  onlyValid?: boolean
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchSafetyProgramsRequest());

      const params = new QueryBuilder()
        .top(1000)
        .filter(filter => {
          searchTerm && filter.filterBy('title', Contains, searchTerm);
          onlyValid && filter.and(f => f.filterBy('status', Equals, 'Valid'));
          return filter;
        })
        .orderBy(orderBy)
        .toQueryParam();

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyPrograms', {
        params
      });

      dispatch(fetchSafetyProgramsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchSafetyProgramsFailure(error));
      reject(error);
    }
  });

export const fetchAssignableSafetyPrograms = (
  clientId: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchSafetyProgramsRequest());

      const safetyProgramIdsData = await fetchAll<{ safetyProgramId: string }>('/api/v3.01/safetyProgramMandates', {
        params: {
          $filter: `clientId eq ${clientId}`,
          $select: 'safetyProgramId'
        }
      });

      const filters = [`(status eq '${SafetyProgramStatus.Valid}')`];
      if (safetyProgramIdsData.value.length > 0) {
        filters.push(`(not (id in (${safetyProgramIdsData.value.map(({ safetyProgramId }) => safetyProgramId)})))`);
      }

      const data = await fetchAll<ISafetyProgram>('/api/v3.01/safetyPrograms', {
        params: {
          $orderby: 'title',
          $filter: filters.join(' and ')
        }
      });

      dispatch(fetchSafetyProgramsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchSafetyProgramsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchSafetyProgramsRequest>
  | ReturnType<typeof fetchSafetyProgramsSuccess>
  | ReturnType<typeof fetchSafetyProgramsFailure>;
