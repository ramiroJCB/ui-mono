import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const deleteRequirementOverrideRequest = () =>
  ({
    type: 'DELETE_REQUIREMENT_OVERRIDE_REQUEST'
  } as const);

const deleteRequirementOverrideSuccess = () =>
  ({
    type: 'DELETE_REQUIREMENT_OVERRIDE_SUCCESS'
  } as const);

const deleteRequirementOverrideFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_REQUIREMENT_OVERRIDE_FAILURE',
    error
  } as const;
};

export const deleteRequirementOverride = (
  id: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteRequirementOverrideRequest());

      await axios.delete(`/api/v3.01/safetyProgramRequirementOverrideRequests(${id})`);

      dispatch(deleteRequirementOverrideSuccess());
      dispatch(
        enqueueSnackbar({
          message: i18next.t(
            'safetyPrograms.requirementOverrides.exceptionRequestCanceled',
            'Exception request has been canceled.'
          ),
          options: {
            variant: 'success'
          }
        })
      );
      resolve();
    } catch (error) {
      dispatch(deleteRequirementOverrideFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteRequirementOverrideRequest>
  | ReturnType<typeof deleteRequirementOverrideSuccess>
  | ReturnType<typeof deleteRequirementOverrideFailure>;
