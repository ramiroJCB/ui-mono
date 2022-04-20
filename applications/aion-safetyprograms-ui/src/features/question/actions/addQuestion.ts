import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAddQuestion, IQuestion } from 'interfaces/question';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const addQuestionRequest = () =>
  ({
    type: 'ADD_QUESTION_REQUEST'
  } as const);

const addQuestionSuccess = (payload: IQuestion) =>
  ({
    type: 'ADD_QUESTION_SUCCESS',
    payload
  } as const);

const addQuestionFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_QUESTION_FAILURE',
    error
  } as const;
};

export const addQuestion = (
  values: IAddQuestion
): ThunkAction<Promise<IQuestion>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addQuestionRequest());

      const { data } = await axios.post<IQuestion>('/api/v3.01/safetyProgramQuestions', values);

      dispatch(addQuestionSuccess(data));
      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.question.questionSaved', 'Your question has been saved.'),
          options: {
            variant: 'success'
          }
        })
      );
      resolve(data);
    } catch (error) {
      dispatch(addQuestionFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addQuestionRequest>
  | ReturnType<typeof addQuestionSuccess>
  | ReturnType<typeof addQuestionFailure>;
