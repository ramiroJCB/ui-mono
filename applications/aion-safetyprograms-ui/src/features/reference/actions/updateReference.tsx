import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IReference } from 'interfaces/reference';
import { PercentCrop } from 'react-image-crop';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateReferenceRequest = () =>
  ({
    type: 'UPDATE_REFERENCE_REQUEST'
  } as const);

const updateReferenceSuccess = (payload: IReference) =>
  ({
    type: 'UPDATE_REFERENCE_SUCCESS',
    payload
  } as const);

const updateReferenceFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_REFERENCE_FAILURE',
    error
  } as const;
};

export const updateReference = (
  id: string,
  pageNumber: number,
  selectionLocation: PercentCrop
): ThunkAction<Promise<IReference>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateReferenceRequest());

      const { data } = await axios.patch<IReference>(`/api/v3.01/safetyProgramDocumentReferences(${id})`, [
        {
          op: 'replace',
          path: '/PageNumber',
          value: pageNumber
        },
        {
          op: 'replace',
          path: '/SelectionLocation',
          value: selectionLocation
        }
      ]);

      dispatch(updateReferenceSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateReferenceFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateReferenceRequest>
  | ReturnType<typeof updateReferenceSuccess>
  | ReturnType<typeof updateReferenceFailure>;
