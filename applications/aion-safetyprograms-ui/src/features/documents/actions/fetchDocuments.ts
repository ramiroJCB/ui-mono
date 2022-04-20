import axios, { AxiosError } from 'axios';
import { escapeSingleQuote } from '@pec/aion-ui-core/helpers/escapeSingleQuote';
import { IDocument } from 'interfaces/document';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const $top = 25;

type ResponseData = { value: IDocument[]; '@odata.count': number };

const fetchDocumentsRequest = (page: number, searchTerm: string, $orderby: string) =>
  ({
    type: 'FETCH_DOCUMENTS_REQUEST',
    page,
    searchTerm,
    $orderby
  } as const);

const fetchDocumentsSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_DOCUMENTS_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchDocumentsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_DOCUMENTS_FAILURE',
    error
  } as const;
};

export const fetchDocuments = (
  organizationId: string,
  page: number,
  searchTerm: string,
  $orderby: string,
  clientId?: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchDocumentsRequest(page, searchTerm, $orderby));
      const filters = [];

      if (organizationId) {
        filters.push(`organizationId eq ${organizationId}`);
      }

      if (searchTerm) {
        filters.push(`contains(tolower(fileName),'${escapeSingleQuote(searchTerm).toLowerCase()}')`);
      }

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramDocumentMetadata', {
        params: {
          $top,
          $orderby,
          $skip: page * $top,
          $filter: filters.map(filter => `(${filter})`).join(' and ') || undefined,
          clientId
        }
      });

      dispatch(fetchDocumentsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchDocumentsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchDocumentsRequest>
  | ReturnType<typeof fetchDocumentsSuccess>
  | ReturnType<typeof fetchDocumentsFailure>;
