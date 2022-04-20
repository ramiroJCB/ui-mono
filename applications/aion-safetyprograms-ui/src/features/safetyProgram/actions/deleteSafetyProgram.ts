import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const deleteSafetyProgramRequest = () =>
  ({
    type: 'DELETE_SAFETY_PROGRAM_REQUEST'
  } as const);

const deleteSafetyProgramSuccess = () =>
  ({
    type: 'DELETE_SAFETY_PROGRAM_SUCCESS'
  } as const);

const deleteSafetyProgramFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_SAFETY_PROGRAM_FAILURE',
    error
  } as const;
};

export const deleteSafetyProgram = (
  id: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteSafetyProgramRequest());

      await axios.delete(`/api/v3.01/safetyPrograms(${id})`);

      dispatch(deleteSafetyProgramSuccess());
      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.safetyProgram.programDeleted', 'Your program has been deleted.'),
          options: {
            variant: 'success'
          }
        })
      );
      resolve();
    } catch (error) {
      dispatch(deleteSafetyProgramFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteSafetyProgramRequest>
  | ReturnType<typeof deleteSafetyProgramSuccess>
  | ReturnType<typeof deleteSafetyProgramFailure>;
