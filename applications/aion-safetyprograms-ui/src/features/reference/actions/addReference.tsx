import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchRequirement } from 'features/requirement/actions/fetchRequirement';
import { IAddReference, IReference } from 'interfaces/reference';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addReferenceRequest = () =>
  ({
    type: 'ADD_REFERENCE_REQUEST'
  } as const);

const addReferenceSuccess = (payload: IReference) =>
  ({
    type: 'ADD_REFERENCE_SUCCESS',
    payload
  } as const);

const addReferenceFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_REFERENCE_FAILURE',
    error
  } as const;
};

export const addReference = (
  safetyProgramRequirementId: string,
  values: IAddReference
): ThunkAction<Promise<IReference>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addReferenceRequest());

      const { data } = await axios.post<IReference>('/api/v3.01/safetyProgramDocumentReferences', values);

      dispatch(fetchRequirement(safetyProgramRequirementId));
      dispatch(addReferenceSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addReferenceFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addReferenceRequest>
  | ReturnType<typeof addReferenceSuccess>
  | ReturnType<typeof addReferenceFailure>;
