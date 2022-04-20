import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const deleteQuestionRequest = () =>
  ({
    type: 'DELETE_QUESTION_REQUEST'
  } as const);

const deleteQuestionSuccess = () =>
  ({
    type: 'DELETE_QUESTION_SUCCESS'
  } as const);

const deleteQuestionFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_QUESTION_FAILURE',
    error
  } as const;
};

export const deleteQuestion = (id: string): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteQuestionRequest());

      await axios.delete(`/api/v3.01/safetyProgramQuestions(${id})`);

      dispatch(deleteQuestionSuccess());
      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.question.questionDeleted', 'Your question has been deleted.'),
          options: {
            variant: 'success'
          }
        })
      );
      resolve();
    } catch (error) {
      dispatch(deleteQuestionFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteQuestionRequest>
  | ReturnType<typeof deleteQuestionSuccess>
  | ReturnType<typeof deleteQuestionFailure>;
