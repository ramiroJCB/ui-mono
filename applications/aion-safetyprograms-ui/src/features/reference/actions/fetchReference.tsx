import axios, { AxiosError } from 'axios';
import { IReference } from 'interfaces/reference';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchReferenceRequest = () =>
  ({
    type: 'FETCH_REFERENCE_REQUEST'
  } as const);

const fetchReferenceSuccess = (payload: IReference) =>
  ({
    type: 'FETCH_REFERENCE_SUCCESS',
    payload
  } as const);

const fetchReferenceFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REFERENCE_FAILURE',
    error
  } as const;
};

export const fetchReference = (
  id: string
): ThunkAction<Promise<IReference>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchReferenceRequest());

      const { data } = await axios.get<IReference>(`/api/v3.01/safetyProgramDocumentReferences(${id})`, {
        params: {
          $expand: 'DocumentMetadata'
        }
      });

      dispatch(fetchReferenceSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchReferenceFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchReferenceRequest>
  | ReturnType<typeof fetchReferenceSuccess>
  | ReturnType<typeof fetchReferenceFailure>;
