import axios, { AxiosError } from 'axios';
import { IDocument } from 'interfaces/document';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchDocumentRequest = () =>
  ({
    type: 'FETCH_DOCUMENT_REQUEST'
  } as const);

const fetchDocumentSuccess = (payload: IDocument) =>
  ({
    type: 'FETCH_DOCUMENT_SUCCESS',
    payload
  } as const);

const fetchDocumentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_DOCUMENT_FAILURE',
    error
  } as const;
};

export const fetchDocument = (
  id: string
): ThunkAction<Promise<IDocument>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchDocumentRequest());

      const { data } = await axios.get<IDocument>(`/api/v3.01/safetyProgramDocumentMetadata(${id})`);

      dispatch(fetchDocumentSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchDocumentFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchDocumentRequest>
  | ReturnType<typeof fetchDocumentSuccess>
  | ReturnType<typeof fetchDocumentFailure>;
