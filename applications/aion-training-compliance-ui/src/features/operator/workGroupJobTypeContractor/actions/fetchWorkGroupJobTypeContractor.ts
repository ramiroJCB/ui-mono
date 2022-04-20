import axios, { AxiosError } from 'axios';
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchWorkGroupJobTypeContractorRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTOR_REQUEST'
  } as const);

const fetchWorkGroupJobTypeContractorSuccess = (payload: IOperatorWorkGroupJobTypeContractor) =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTOR_SUCCESS',
    payload
  } as const);

const fetchWorkGroupJobTypeContractorFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTOR_FAILURE',
    error
  } as const;
};

const shouldFetchWorkGroupJobTypeContractor = (
  workGroupJobTypeContractorId: string,
  { workGroupJobTypeContractor: { isFetching, workGroupJobTypeContractor } }: RootState
) =>
  (!workGroupJobTypeContractor && !isFetching) ||
  (workGroupJobTypeContractor && workGroupJobTypeContractorId !== workGroupJobTypeContractor.id);

const fetchWorkGroupJobTypeContractor = (
  workGroupJobTypeContractorId: string
): ThunkAction<Promise<IOperatorWorkGroupJobTypeContractor>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchWorkGroupJobTypeContractorRequest());
      const params = new QueryBuilder().expand('contractor').toQueryParam();
      const { data } = await axios.get<IOperatorWorkGroupJobTypeContractor>(
        `/api/trainingCompliance/v3.01/workGroupJobTypeContractors(${workGroupJobTypeContractorId})`,
        { params }
      );

      dispatch(fetchWorkGroupJobTypeContractorSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchWorkGroupJobTypeContractorFailure(error));
      reject();
    }
  });

export const fetchWorkGroupJobTypeContractorIfNeeded = (
  workGroupJobTypeContractorId: string
): ThunkAction<Promise<IOperatorWorkGroupJobTypeContractor>, RootState, null, Actions> => (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    try {
      if (shouldFetchWorkGroupJobTypeContractor(workGroupJobTypeContractorId, getState())) {
        const data = await dispatch(fetchWorkGroupJobTypeContractor(workGroupJobTypeContractorId));
        resolve(data);
      } else {
        const { workGroupJobTypeContractor } = getState().workGroupJobTypeContractor;
        workGroupJobTypeContractor && resolve(workGroupJobTypeContractor);
      }
    } catch (error) {
      dispatch(fetchWorkGroupJobTypeContractorFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchWorkGroupJobTypeContractorRequest>
  | ReturnType<typeof fetchWorkGroupJobTypeContractorSuccess>
  | ReturnType<typeof fetchWorkGroupJobTypeContractorFailure>;
