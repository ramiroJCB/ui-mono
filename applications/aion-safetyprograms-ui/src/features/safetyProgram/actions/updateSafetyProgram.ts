import axios, { AxiosError } from 'axios';
import { AnyAction } from 'redux';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchSafetyProgram } from './fetchSafetyProgram';
import { IEditSafetyProgram, ISafetyProgram } from 'interfaces/safetyProgram';
import { IQuestion } from 'interfaces/question';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { updateGracePeriodPrompted } from './updateGracePeriodPrompted';
import i18next from 'i18next';

const updateSafetyProgramRequest = () =>
  ({
    type: 'UPDATE_SAFETY_PROGRAM_REQUEST'
  } as const);

const updateSafetyProgramSuccess = (payload: ISafetyProgram) =>
  ({
    type: 'UPDATE_SAFETY_PROGRAM_SUCCESS',
    payload
  } as const);

const updateSafetyProgramFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_SAFETY_PROGRAM_FAILURE',
    error
  } as const;
};

const updateSafetyProgramQuestionsOrder = (sourceIndex: number, destinationIndex: number) =>
  ({
    type: 'UPDATE_SAFETY_PROGRAM_QUESTIONS_ORDER',
    sourceIndex,
    destinationIndex
  } as const);

export const updateSafetyProgram = ({
  id,
  title,
  gracePeriodExpirationDateUtc
}: IEditSafetyProgram): ThunkAction<Promise<ISafetyProgram>, RootState, null, AnyAction> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateSafetyProgramRequest());
      const resetPromptedStatus = gracePeriodExpirationDateUtc === null;

      const { data } = await axios.patch<ISafetyProgram>(`/api/v3.01/safetyPrograms(${id})`, [
        {
          op: 'replace',
          path: '/Title',
          value: title
        },
        {
          op: 'replace',
          path: '/GracePeriodExpirationDateUtc',
          value: gracePeriodExpirationDateUtc
        }
      ]);

      resetPromptedStatus && dispatch(updateGracePeriodPrompted(false));
      dispatch(updateSafetyProgramSuccess(data));
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
      dispatch(updateSafetyProgramFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export const updateQuestionSortOrder = (
  safetyProgramId: string,
  questionId: string,
  sortOrder: number,
  sourceIndex: number,
  destinationIndex: number
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateSafetyProgramQuestionsOrder(sourceIndex, destinationIndex));

      await axios.patch<IQuestion>(`/api/v3.01/safetyProgramQuestions(${questionId})`, [
        { op: 'replace', path: '/SortOrder', value: sortOrder }
      ]);

      dispatch(fetchSafetyProgram(safetyProgramId));
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
      dispatch(updateSafetyProgramFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateSafetyProgramRequest>
  | ReturnType<typeof updateSafetyProgramSuccess>
  | ReturnType<typeof updateSafetyProgramFailure>
  | ReturnType<typeof updateSafetyProgramQuestionsOrder>;
