import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchRequirement } from 'features/requirement/actions/fetchRequirement';
import { IComment } from 'interfaces/comment';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateCommentRequest = () =>
  ({
    type: 'UPDATE_COMMENT_REQUEST'
  } as const);

const updateCommentSuccess = (payload: IComment) =>
  ({
    type: 'UPDATE_COMMENT_SUCCESS',
    payload
  } as const);

const updateCommentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_COMMENT_FAILURE',
    error
  } as const;
};

export const updateComment = (
  safetyProgramRequirementId: string,
  commentId: string,
  isRead: boolean
): ThunkAction<Promise<IComment>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateCommentRequest());

      const { data } = await axios.patch<IComment>(`/api/v3.01/safetyProgramComments(${commentId})`, [
        {
          op: 'replace',
          path: '/IsRead',
          value: isRead
        }
      ]);

      dispatch(fetchRequirement(safetyProgramRequirementId));
      dispatch(updateCommentSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateCommentFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateCommentRequest>
  | ReturnType<typeof updateCommentSuccess>
  | ReturnType<typeof updateCommentFailure>;
