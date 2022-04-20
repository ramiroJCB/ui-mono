import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchRequirement } from 'features/requirement/actions/fetchRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const deleteCommentRequest = () =>
  ({
    type: 'DELETE_COMMENT_REQUEST'
  } as const);

const deleteCommentSuccess = (id: string) =>
  ({
    type: 'DELETE_COMMENT_SUCCESS',
    id
  } as const);

const deleteCommentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_COMMENT_FAILURE',
    error
  } as const;
};

export const deleteComment = (
  safetyProgramRequirementId: string,
  commentId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteCommentRequest());

      await axios.delete(`/api/v3.01/safetyProgramComments(${commentId})`);

      dispatch(fetchRequirement(safetyProgramRequirementId));
      dispatch(deleteCommentSuccess(commentId));
      resolve();
    } catch (error) {
      dispatch(deleteCommentFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteCommentRequest>
  | ReturnType<typeof deleteCommentSuccess>
  | ReturnType<typeof deleteCommentFailure>;
