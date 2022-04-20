import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { RouteParams } from '../containers/WorkGroupJobTypeContractorGeneralInfo';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const unassignWorkGroupJobTypeContractorRequest = () =>
  ({
    type: 'UNASSIGN_WORK_GROUP_JOB_TYPE_CONTRACTOR_REQUEST'
  } as const);

const unassignWorkGroupJobTypeContractorSuccess = (payload: string) =>
  ({
    type: 'UNASSIGN_WORK_GROUP_JOB_TYPE_CONTRACTOR_SUCCESS',
    payload
  } as const);

const unassignWorkGroupJobTypeContractorFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UNASSIGN_WORK_GROUP_JOB_TYPE_CONTRACTOR_FAILURE',
    error
  } as const;
};

export const unassignWorkGroupJobTypeContractor = (
  workGroupJobTypeContractorId: string,
  routeProps?: RouteComponentProps<RouteParams>
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(unassignWorkGroupJobTypeContractorRequest());

      await axios.delete(`/api/trainingCompliance/v3.01/workGroupJobTypeContractors(${workGroupJobTypeContractorId})`);

      dispatch(unassignWorkGroupJobTypeContractorSuccess(workGroupJobTypeContractorId));
      resolve();

      if (routeProps) {
        const {
          history,
          match: {
            params: { organizationId, workGroupId, workGroupJobTypeId }
          }
        } = routeProps;

        history.push(
          `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}`
        );
      }
    } catch (error) {
      dispatch(unassignWorkGroupJobTypeContractorFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof unassignWorkGroupJobTypeContractorRequest>
  | ReturnType<typeof unassignWorkGroupJobTypeContractorSuccess>
  | ReturnType<typeof unassignWorkGroupJobTypeContractorFailure>;
