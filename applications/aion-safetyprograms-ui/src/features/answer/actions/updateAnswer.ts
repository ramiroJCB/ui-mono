import axios, { AxiosError } from 'axios';
import { AnswerStatus, IAnswer, IAnswerForm } from 'interfaces/answer';
import { fetchRequirement } from 'features/requirement/actions/fetchRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateAnswerRequest = () =>
  ({
    type: 'UPDATE_ANSWER_REQUEST'
  } as const);

const updateAnswerSuccess = (payload: IAnswer) =>
  ({
    type: 'UPDATE_ANSWER_SUCCESS',
    payload
  } as const);

const updateAnswerFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_ANSWER_FAILURE',
    error
  } as const;
};

export const updateAnswer = (
  values: IAnswerForm
): ThunkAction<Promise<IAnswer>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateAnswerRequest());

      const { id, answerValue, safetyProgramRequirementId } = values;
      const { data } = id
        ? await axios.patch<IAnswer>(`/api/v3.01/safetyProgramQuestionAnswers(${id})`, [
            {
              op: 'replace',
              path: '/AnswerValue',
              value: answerValue === 'true'
            }
          ])
        : await axios.post<IAnswer>('/api/v3.01/safetyProgramQuestionAnswers', values);

      dispatch(fetchRequirement(safetyProgramRequirementId));
      dispatch(updateAnswerSuccess(data));
      resolve();
    } catch (error) {
      dispatch(updateAnswerFailure(error));
      reject(error);
    }
  });

export const updateAnswerStatus = (
  safetyProgramRequirementId: string,
  answerId: string,
  status: AnswerStatus
): ThunkAction<Promise<IAnswer>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateAnswerRequest());

      const { data } = await axios.patch<IAnswer>(`/api/v3.01/safetyProgramQuestionAnswers(${answerId})`, [
        {
          op: 'replace',
          path: '/Status',
          value: status
        }
      ]);

      dispatch(fetchRequirement(safetyProgramRequirementId));
      dispatch(updateAnswerSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateAnswerFailure(error));
      reject(error);
    }
  });

export const resetAnswerStatus = (
  safetyProgramRequirementId: string,
  answerId: string
): ThunkAction<Promise<IAnswer>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateAnswerRequest());

      const { data } = await axios.put<IAnswer>(`/api/v3.01/safetyProgramQuestionAnswers(${answerId})/undoEvaluation`);

      dispatch(fetchRequirement(safetyProgramRequirementId));
      dispatch(updateAnswerSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateAnswerFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateAnswerRequest>
  | ReturnType<typeof updateAnswerSuccess>
  | ReturnType<typeof updateAnswerFailure>;
