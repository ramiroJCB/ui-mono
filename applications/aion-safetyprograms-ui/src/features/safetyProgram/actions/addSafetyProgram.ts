import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAddSafetyProgram, ISafetyProgram } from 'interfaces/safetyProgram';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const addSafetyProgramRequest = () =>
  ({
    type: 'ADD_SAFETY_PROGRAM_REQUEST'
  } as const);

const addSafetyProgramSuccess = (payload: ISafetyProgram) =>
  ({
    type: 'ADD_SAFETY_PROGRAM_SUCCESS',
    payload
  } as const);

const addSafetyProgramFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_SAFETY_PROGRAM_FAILURE',
    error
  } as const;
};

export const addSafetyProgram = (
  values: IAddSafetyProgram
): ThunkAction<Promise<ISafetyProgram>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addSafetyProgramRequest());

      const { data } = await axios.post<ISafetyProgram>('/api/v3.01/safetyPrograms', values);

      dispatch(addSafetyProgramSuccess(data));
      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.safetyProgram.safetyProgramSaved', 'Your safety program has been saved.'),
          options: {
            variant: 'success'
          }
        })
      );
      resolve(data);
    } catch (error) {
      dispatch(addSafetyProgramFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addSafetyProgramRequest>
  | ReturnType<typeof addSafetyProgramSuccess>
  | ReturnType<typeof addSafetyProgramFailure>;
