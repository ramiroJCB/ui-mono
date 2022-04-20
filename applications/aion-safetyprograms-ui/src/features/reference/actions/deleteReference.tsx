import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchRequirement } from 'features/requirement/actions/fetchRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteReferenceRequest = () =>
  ({
    type: 'DELETE_REFERENCE_REQUEST'
  } as const);

const deleteReferenceSuccess = () =>
  ({
    type: 'DELETE_REFERENCE_SUCCESS'
  } as const);

const deleteReferenceFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_REFERENCE_FAILURE',
    error
  } as const;
};

export const deleteReference = (
  safetyProgramRequirementId: string,
  documentReferenceId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteReferenceRequest());

      await axios.delete(`/api/v3.01/safetyProgramDocumentReferences(${documentReferenceId})`);

      dispatch(fetchRequirement(safetyProgramRequirementId));
      dispatch(deleteReferenceSuccess());
      resolve();
    } catch (error) {
      dispatch(deleteReferenceFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteReferenceRequest>
  | ReturnType<typeof deleteReferenceSuccess>
  | ReturnType<typeof deleteReferenceFailure>;
