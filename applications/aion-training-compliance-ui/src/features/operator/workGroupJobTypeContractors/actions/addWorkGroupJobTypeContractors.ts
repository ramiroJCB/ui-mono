import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { History } from 'history';
import { IContractor } from 'interfaces/contractor';
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addWorkGroupJobTypeContractorsRequest = () =>
  ({
    type: 'ADD_WORK_GROUP_JOB_TYPE_CONTRACTORS_REQUEST'
  } as const);

const addWorkGroupJobTypeContractorsSuccess = (payload: IOperatorWorkGroupJobTypeContractor[]) =>
  ({
    type: 'ADD_WORK_GROUP_JOB_TYPE_CONTRACTORS_SUCCESS',
    payload
  } as const);

const addWorkGroupJobTypeContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_WORK_GROUP_JOB_TYPE_CONTRACTORS_FAILURE',
    error
  } as const;
};

export const addWorkGroupJobTypeContractors = (
  history: History,
  organizationId: string,
  workGroupId: string,
  workGroupJobTypeId: string,
  values: IContractor[]
): ThunkAction<Promise<IOperatorWorkGroupJobTypeContractor[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addWorkGroupJobTypeContractorsRequest());

      const { data } = await axios.post<IOperatorWorkGroupJobTypeContractor[]>(
        `/api/trainingCompliance/v3.01/workGroupJobTypes(${workGroupJobTypeId})/contractors`,
        values.map(({ id }) => id)
      );

      dispatch(addWorkGroupJobTypeContractorsSuccess(data));
      resolve(data);
      history.push(`/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}`);
    } catch (error) {
      dispatch(addWorkGroupJobTypeContractorsFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof addWorkGroupJobTypeContractorsRequest>
  | ReturnType<typeof addWorkGroupJobTypeContractorsSuccess>
  | ReturnType<typeof addWorkGroupJobTypeContractorsFailure>;
