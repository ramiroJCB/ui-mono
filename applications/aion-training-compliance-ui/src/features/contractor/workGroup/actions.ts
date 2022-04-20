import axios, { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroupContractor } from 'interfaces/workGroupContractor';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchWorkGroupContractorRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_CONTRACTOR_REQUEST'
  } as const);

const fetchWorkGroupContractorSuccess = (payload: IWorkGroupContractor) =>
  ({
    type: 'FETCH_WORK_GROUP_CONTRACTOR_SUCCESS',
    payload
  } as const);

const fetchWorkGroupContractorFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_CONTRACTOR_FAILURE',
    error
  } as const;
};

const shouldFetchWorkGroupContractor = (
  workGroupContractorId: string,
  { workGroupContractor: { isFetching, workGroupContractor } }: RootState
) => (!workGroupContractor && !isFetching) || (workGroupContractor && workGroupContractorId !== workGroupContractor.id);

const fetchWorkGroupContractor = (
  workGroupContractorId: string
): ThunkAction<Promise<IWorkGroupContractor>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchWorkGroupContractorRequest());
      const params = new QueryBuilder().expand('workGroup').toQueryParam();
      const { data } = await axios.get<IWorkGroupContractor>(
        `/api/trainingCompliance/v3.01/workGroupContractors(${workGroupContractorId})`,
        { params }
      );
      dispatch(fetchWorkGroupContractorSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchWorkGroupContractorFailure(error));
      reject(error);
    }
  });

export const fetchWorkGroupContractorIfNeeded = (
  workGroupContractorId: string
): ThunkAction<Promise<DeepReadonly<IWorkGroupContractor> | null>, RootState, null, Actions> => (dispatch, getState) =>
  new Promise(async resolve => {
    if (shouldFetchWorkGroupContractor(workGroupContractorId, getState())) {
      const data = await dispatch(fetchWorkGroupContractor(workGroupContractorId));
      resolve(data);
    } else {
      const { workGroupContractor } = getState().workGroupContractor;
      resolve(workGroupContractor);
    }
  });

export type Actions =
  | ReturnType<typeof fetchWorkGroupContractorRequest>
  | ReturnType<typeof fetchWorkGroupContractorSuccess>
  | ReturnType<typeof fetchWorkGroupContractorFailure>;
