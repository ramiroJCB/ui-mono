import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchQuestion } from './fetchQuestion';
import { fetchSafetyProgram } from 'features/safetyProgram/actions/fetchSafetyProgram';
import { IEditQuestion, IQuestion } from 'interfaces/question';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const updateQuestionRequest = () =>
  ({
    type: 'UPDATE_QUESTION_REQUEST'
  } as const);

const updateQuestionSuccess = (payload: IQuestion) =>
  ({
    type: 'UPDATE_QUESTION_SUCCESS',
    payload
  } as const);

const updateQuestionFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_QUESTION_FAILURE',
    error
  } as const;
};

const updateQuestionSubquestionsOrder = (sourceIndex: number, destinationIndex: number) =>
  ({
    type: 'UPDATE_QUESTION_SUBQUESTIONS_ORDER',
    sourceIndex,
    destinationIndex
  } as const);

export const updateQuestion = ({
  id,
  title,
  body
}: IEditQuestion): ThunkAction<Promise<IQuestion>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateQuestionRequest());

      const { data } = await axios.patch<IQuestion>(`/api/v3.01/safetyProgramQuestions(${id})`, [
        { op: 'replace', path: '/Title', value: title },
        { op: 'replace', path: '/Body', value: body || null }
      ]);

      dispatch(updateQuestionSuccess(data));
      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.common.updatesSaved', 'Your updates have been saved.'),
          options: {
            variant: 'success'
          }
        })
      );
      resolve();
    } catch (error) {
      dispatch(updateQuestionFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export const updateSubquestionSortOrder = (
  safetyProgramId: string,
  questionId: string,
  subquestionId: string,
  sortOrder: number,
  sourceIndex: number,
  destinationIndex: number
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateQuestionSubquestionsOrder(sourceIndex, destinationIndex));

      await axios.patch<IQuestion>(`/api/v3.01/safetyProgramQuestions(${subquestionId})`, [
        { op: 'replace', path: '/SortOrder', value: sortOrder }
      ]);

      dispatch(fetchSafetyProgram(safetyProgramId));
      dispatch(fetchQuestion(questionId));
      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.common.updatesSaved', 'Your updates have been saved.'),
          options: {
            variant: 'success'
          }
        })
      );
      resolve();
    } catch (error) {
      dispatch(updateQuestionFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateQuestionRequest>
  | ReturnType<typeof updateQuestionSuccess>
  | ReturnType<typeof updateQuestionFailure>
  | ReturnType<typeof updateQuestionSubquestionsOrder>;
