import axios, { AxiosError } from 'axios';
import { ITrainingProgram } from '@pec/aion-ui-core/interfaces/trainingProgram';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const $top = 25;

type ResponseData = { value: ITrainingProgram[]; '@odata.count': number };

const fetchProgramsRequest = () =>
  ({
    type: 'FETCH_PROGRAMS_REQUEST'
  } as const);

const fetchProgramsSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_PROGRAMS_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchProgramsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_PROGRAMS_FAILURE',
    error
  } as const;
};

export const fetchPrograms = (
  searchTerm: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchProgramsRequest());

      const { data } = await axios.get<ResponseData>('/api/v3.01/programs', {
        params: {
          $top,
          $orderby: 'name',
          $filter: `contains(tolower(name),'${searchTerm.toLowerCase()}')`
        }
      });

      dispatch(fetchProgramsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchProgramsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchProgramsRequest>
  | ReturnType<typeof fetchProgramsSuccess>
  | ReturnType<typeof fetchProgramsFailure>;
