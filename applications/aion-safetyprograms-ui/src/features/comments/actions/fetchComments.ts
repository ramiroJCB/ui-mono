import { AxiosError } from 'axios';
import { fetchAll } from '@pec/aion-ui-odata/helpers/fetchAll';
import { IComment } from 'interfaces/comment';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchCommentsRequest = () =>
  ({
    type: 'FETCH_COMMENTS_REQUEST'
  } as const);

const fetchCommentsSuccess = (payload: IComment[], questionAnswerId: string) =>
  ({
    type: 'FETCH_COMMENTS_SUCCESS',
    payload,
    questionAnswerId
  } as const);

const fetchCommentsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_COMMENTS_FAILURE',
    error
  } as const;
};

export const fetchComments = (
  questionAnswerId: string
): ThunkAction<Promise<IComment[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchCommentsRequest());

      const data = await fetchAll<IComment>('/api/v3.01/safetyProgramComments', {
        params: {
          $filter: `questionAnswerId eq ${questionAnswerId}`,
          $orderby: 'createdDateUtc desc'
        }
      });

      dispatch(fetchCommentsSuccess(data.value, questionAnswerId));
      resolve(data.value);
    } catch (error) {
      dispatch(fetchCommentsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchCommentsRequest>
  | ReturnType<typeof fetchCommentsSuccess>
  | ReturnType<typeof fetchCommentsFailure>;
