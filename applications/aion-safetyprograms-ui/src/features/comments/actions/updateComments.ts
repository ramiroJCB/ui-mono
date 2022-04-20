import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchComments } from '../actions/fetchComments';
import { fetchRequirement } from 'features/requirement/actions/fetchRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateCommentsRequest = () =>
  ({
    type: 'UPDATE_COMMENTS_REQUEST'
  } as const);

const updateCommentsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_COMMENTS_FAILURE',
    error
  } as const;
};

export const updateComments = (
  safetyProgramRequirementId: string,
  questionAnswerId: string,
  isRead: boolean
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateCommentsRequest());

      await axios.put(`/api/v3.01/safetyProgramQuestionAnswers(${questionAnswerId})/commentsReadStatus`, {
        isRead
      });

      dispatch(fetchRequirement(safetyProgramRequirementId));
      dispatch(fetchComments(questionAnswerId));
      resolve();
    } catch (error) {
      dispatch(updateCommentsFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions = ReturnType<typeof updateCommentsRequest> | ReturnType<typeof updateCommentsFailure>;
