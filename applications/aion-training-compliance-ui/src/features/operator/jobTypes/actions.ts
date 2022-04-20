import axios, { AxiosError } from 'axios';
import { escapeSingleQuote } from '@pec/aion-ui-core/helpers/escapeSingleQuote';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialJobTypesRequest = () =>
  ({
    type: 'FETCH_INITIAL_JOB_TYPES_REQUEST'
  } as const);

const fetchJobTypesRequest = () =>
  ({
    type: 'FETCH_JOB_TYPES_REQUEST'
  } as const);

const fetchJobTypesSuccess = (payload: IJobType[], totalCount: number) =>
  ({
    type: 'FETCH_JOB_TYPES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchJobTypesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_JOB_TYPES_FAILURE',
    error
  } as const;
};

export const fetchJobTypes = (
  organizationId: string,
  top: number = 0,
  skip: number = 0,
  name?: string | string[],
  jobTypeIds?: string
): ThunkAction<Promise<IJobType[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch((top === 0 ? fetchInitialJobTypesRequest : fetchJobTypesRequest)());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) => {
          const filter = filterBy('name', Contains, name)
            .filterBy('organizationId', Equals, organizationId)
            .filterBy('isDeleted', Equals, false);

          if (jobTypeIds && !Array.isArray(jobTypeIds)) {
            filter.and(f => {
              jobTypeIds.split(',').map(id => f.or(e => e.filterBy('id', Equals, id)));
              return f;
            });
          }

          return filter;
        })
        .orderBy('name')
        .toQueryParam();

      const response = await axios.get<{ value: IJobType[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/jobTypes',
        { params }
      );
      const jobTypes = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;
      dispatch(fetchJobTypesSuccess(jobTypes, totalCount));
      resolve(jobTypes);
    } catch (error) {
      dispatch(fetchJobTypesFailure(error));
      reject(error);
    }
  });

export const fetchJobTypesForValidation = (
  organizationId: string,
  name: string
): ThunkAction<Promise<IJobType[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchJobTypesRequest());

      const response = await axios.get<{ value: IJobType[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/jobTypes',
        {
          params: {
            $filter: `name eq '${escapeSingleQuote(
              name
            )}' and organizationId eq ${organizationId} and isDeleted eq false`
          }
        } // TODO replace params with odata builder
      );
      const jobTypes = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchJobTypesSuccess(jobTypes, totalCount));
      resolve(jobTypes);
    } catch (error) {
      dispatch(fetchJobTypesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialJobTypesRequest>
  | ReturnType<typeof fetchJobTypesRequest>
  | ReturnType<typeof fetchJobTypesSuccess>
  | ReturnType<typeof fetchJobTypesFailure>;
