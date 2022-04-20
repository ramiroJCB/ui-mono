import axios, { AxiosError } from 'axios';
import { IExpandedSafetyProgram } from 'interfaces/safetyProgram';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchSafetyProgramRequest = () =>
  ({
    type: 'FETCH_SAFETY_PROGRAM_REQUEST'
  } as const);

const fetchSafetyProgramSuccess = (payload: IExpandedSafetyProgram) =>
  ({
    type: 'FETCH_SAFETY_PROGRAM_SUCCESS',
    payload
  } as const);

const fetchSafetyProgramFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_SAFETY_PROGRAM_FAILURE',
    error
  } as const;
};

const shouldFetchSafetyProgram = (id: string, { safetyProgram: { safetyProgram, isFetching } }: RootState) =>
  !isFetching && (!safetyProgram || safetyProgram.id !== id);

export const fetchSafetyProgram = (
  id: string
): ThunkAction<Promise<IExpandedSafetyProgram>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchSafetyProgramRequest());

      const { data } = await axios.get<IExpandedSafetyProgram>(`/api/v3.01/safetyPrograms(${id})`, {
        params: {
          $expand: 'questions'
        }
      });

      dispatch(fetchSafetyProgramSuccess({ ...data, gracePeriodNeeded: data.gracePeriodExpirationDateUtc !== null }));
      resolve(data);
    } catch (error) {
      dispatch(fetchSafetyProgramFailure(error));
      reject(error);
    }
  });

export const fetchSafetyProgramIfNeeded = (id: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchSafetyProgram(id, getState())) {
    dispatch(fetchSafetyProgram(id));
  }
};

export type Actions =
  | ReturnType<typeof fetchSafetyProgramRequest>
  | ReturnType<typeof fetchSafetyProgramSuccess>
  | ReturnType<typeof fetchSafetyProgramFailure>;
