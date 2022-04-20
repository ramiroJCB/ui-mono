import axios, { AxiosError } from 'axios';
import { escapeSingleQuote } from '@pec/aion-ui-core/helpers/escapeSingleQuote';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialWorkGroupJobTypesRequest = () =>
  ({
    type: 'FETCH_INITIAL_WORK_GROUP_JOB_TYPES_REQUEST'
  } as const);

const fetchWorkGroupJobTypesRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPES_REQUEST'
  } as const);

const fetchWorkGroupJobTypesSuccess = (payload: IWorkGroupJobType[], totalCount: number) =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchWorkGroupJobTypesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_JOB_TYPES_FAILURE',
    error
  } as const;
};

export const fetchWorkGroupJobTypes = (
  workGroupId: string,
  top: number = 0,
  skip: number = 0,
  jobTypeName?: string | string[]
): ThunkAction<Promise<IWorkGroupJobType[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch((top === 0 ? fetchInitialWorkGroupJobTypesRequest : fetchWorkGroupJobTypesRequest)());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('workGroupId', Equals, workGroupId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('jobTypeName', Contains, jobTypeName)
        )
        .orderBy('jobTypeName')
        .toQueryParam();

      const response = await axios.get<{ value: IWorkGroupJobType[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypes',
        { params }
      );
      const workGroupJobTypes = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchWorkGroupJobTypesSuccess(workGroupJobTypes, totalCount));
      resolve(workGroupJobTypes);
    } catch (error) {
      dispatch(fetchWorkGroupJobTypesFailure(error));
      reject(error);
    }
  });

export const fetchWorkGroupJobTypesForValidation = (
  name: string
): ThunkAction<Promise<IWorkGroupJobType[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchWorkGroupJobTypesRequest());

      const response = await axios.get<{ value: IWorkGroupJobType[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypes',
        { params: { $filter: `name eq '${escapeSingleQuote(name)}'` } } // TODO replace params with odata builder
      );
      const workGroupJobTypes = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchWorkGroupJobTypesSuccess(workGroupJobTypes, totalCount));
      resolve(workGroupJobTypes);
    } catch (error) {
      dispatch(fetchWorkGroupJobTypesFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialWorkGroupJobTypesRequest>
  | ReturnType<typeof fetchWorkGroupJobTypesRequest>
  | ReturnType<typeof fetchWorkGroupJobTypesSuccess>
  | ReturnType<typeof fetchWorkGroupJobTypesFailure>;
