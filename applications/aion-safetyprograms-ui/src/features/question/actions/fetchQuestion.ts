import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IExpandedQuestion } from 'interfaces/question';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchQuestionRequest = () =>
  ({
    type: 'FETCH_QUESTION_REQUEST'
  } as const);

const fetchQuestionSuccess = (payload: IExpandedQuestion) =>
  ({
    type: 'FETCH_QUESTION_SUCCESS',
    payload
  } as const);

const fetchQuestionFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_QUESTION_FAILURE',
    error
  } as const;
};

export const fetchQuestion = (
  id: string
): ThunkAction<Promise<IExpandedQuestion>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchQuestionRequest());

      const { data } = await axios.get<IExpandedQuestion>(`/api/v3.01/safetyProgramQuestions(${id})`, {
        params: {
          $expand: 'questions($orderby=sortOrder)'
        }
      });

      dispatch(fetchQuestionSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchQuestionFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchQuestionRequest>
  | ReturnType<typeof fetchQuestionSuccess>
  | ReturnType<typeof fetchQuestionFailure>;
