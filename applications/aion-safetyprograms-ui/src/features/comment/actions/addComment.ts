import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchRequirement } from 'features/requirement/actions/fetchRequirement';
import { IComment } from 'interfaces/comment';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addCommentRequest = () =>
  ({
    type: 'ADD_COMMENT_REQUEST'
  } as const);

const addCommentSuccess = (payload: IComment) =>
  ({
    type: 'ADD_COMMENT_SUCCESS',
    payload
  } as const);

const addCommentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_COMMENT_FAILURE',
    error
  } as const;
};

export const addComment = (
  safetyProgramRequirementId: string,
  questionAnswerId: string,
  value: string,
  isEvaluatorComment: boolean
): ThunkAction<Promise<IComment>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addCommentRequest());

      const { data } = await axios.post<IComment>('/api/v3.01/safetyProgramComments', {
        questionAnswerId,
        comments: value,
        isEvaluatorComment
      });

      dispatch(fetchRequirement(safetyProgramRequirementId));
      dispatch(addCommentSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addCommentFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addCommentRequest>
  | ReturnType<typeof addCommentSuccess>
  | ReturnType<typeof addCommentFailure>;
