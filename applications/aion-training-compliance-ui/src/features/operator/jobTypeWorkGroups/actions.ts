import axios, { AxiosError } from 'axios';
import { IJobTypeWorkGroup } from 'interfaces/jobTypeWorkGroup';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialJobTypeWorkGroupsRequest = () =>
  ({
    type: 'FETCH_INITIAL_JOB_TYPE_WORK_GROUPS_REQUEST'
  } as const);

const fetchJobTypeWorkGroupsRequest = () =>
  ({
    type: 'FETCH_JOB_TYPE_WORK_GROUPS_REQUEST'
  } as const);

const fetchJobTypeWorkGroupsSuccess = (payload: IJobTypeWorkGroup[], totalCount: number) =>
  ({
    type: 'FETCH_JOB_TYPE_WORK_GROUPS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchJobTypeWorkGroupsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_JOB_TYPE_WORK_GROUPS_FAILURE',
    error
  } as const;
};

export const fetchJobTypeWorkGroups = (
  jobTypeId: string,
  top: number = 0,
  skip: number = 0,
  workGroupName?: string | string[]
): ThunkAction<Promise<IJobTypeWorkGroup[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch((top === 0 ? fetchInitialJobTypeWorkGroupsRequest : fetchJobTypeWorkGroupsRequest)());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .expand('workGroup')
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('jobTypeId', Equals, jobTypeId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('workGroupName', Contains, workGroupName)
        )
        .orderBy('workGroupName')
        .toQueryParam();

      const response = await axios.get<{ value: IJobTypeWorkGroup[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypes',
        { params }
      );
      const jobTypeWorkGroups = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchJobTypeWorkGroupsSuccess(jobTypeWorkGroups, totalCount));
      resolve(jobTypeWorkGroups);
    } catch (error) {
      dispatch(fetchJobTypeWorkGroupsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialJobTypeWorkGroupsRequest>
  | ReturnType<typeof fetchJobTypeWorkGroupsRequest>
  | ReturnType<typeof fetchJobTypeWorkGroupsSuccess>
  | ReturnType<typeof fetchJobTypeWorkGroupsFailure>;
