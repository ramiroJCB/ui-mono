import axios, { AxiosError, CancelTokenSource } from 'axios';
import { IDocument } from 'interfaces/document';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addDocumentRequest = (source: CancelTokenSource) =>
  ({
    type: 'ADD_DOCUMENT_REQUEST',
    source
  } as const);

const addDocumentProgress = (progress: number) =>
  ({
    type: 'ADD_DOCUMENT_PROGRESS',
    progress
  } as const);

const addDocumentSuccess = (payload: IDocument) =>
  ({
    type: 'ADD_DOCUMENT_SUCCESS',
    payload
  } as const);

const addDocumentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_DOCUMENT_FAILURE',
    error
  } as const;
};

export const addDocumentReset = () =>
  ({
    type: 'ADD_DOCUMENT_RESET'
  } as const);

export const addDocument = (
  file: File,
  newFileName?: string
): ThunkAction<Promise<IDocument | void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      const source = axios.CancelToken.source();

      dispatch(addDocumentRequest(source));

      const formData = new FormData();
      formData.append('File', file, newFileName || file.name);

      const { data } = await axios.post<IDocument>('/files/v1/safetyProgramDocuments', formData, {
        cancelToken: source.token,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: ({ loaded, total }: ProgressEvent) => {
          dispatch(addDocumentProgress((loaded / total) * 100));
        }
      });

      dispatch(addDocumentSuccess(data));
      resolve(data);
    } catch (error) {
      if (axios.isCancel(error)) {
        dispatch(addDocumentReset());
        resolve();
      } else {
        dispatch(addDocumentFailure(error));
        reject(error);
      }
    }
  });

export type Actions =
  | ReturnType<typeof addDocumentRequest>
  | ReturnType<typeof addDocumentProgress>
  | ReturnType<typeof addDocumentSuccess>
  | ReturnType<typeof addDocumentFailure>
  | ReturnType<typeof addDocumentReset>;
