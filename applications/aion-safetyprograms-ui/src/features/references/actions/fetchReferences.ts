import { AxiosError } from 'axios';
import { fetchAll } from '@pec/aion-ui-odata/helpers/fetchAll';
import { IReference } from 'interfaces/reference';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchReferencesRequest = () =>
  ({
    type: 'FETCH_REFERENCES_REQUEST'
  } as const);

const fetchReferencesSuccess = (payload: IReference[], questionAnswerId: string) =>
  ({
    type: 'FETCH_REFERENCES_SUCCESS',
    payload,
    questionAnswerId
  } as const);

const fetchReferencesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REFERENCES_FAILURE',
    error
  } as const;
};

export const fetchReferences = (
  questionAnswerId: string
): ThunkAction<Promise<IReference[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchReferencesRequest());

      const data = await fetchAll<IReference>('/api/v3.01/safetyProgramDocumentReferences', {
        params: {
          $filter: `questionAnswerId eq ${questionAnswerId}`,
          $expand: 'DocumentMetadata',
          $orderby: 'createdDateUtc'
        }
      });

      dispatch(fetchReferencesSuccess(data.value, questionAnswerId));
      resolve(data.value);
    } catch (error) {
      dispatch(fetchReferencesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchReferencesRequest>
  | ReturnType<typeof fetchReferencesSuccess>
  | ReturnType<typeof fetchReferencesFailure>;
