import axios, { AxiosError } from 'axios';
import { ITrainingProgram } from '@pec/aion-ui-core/interfaces/trainingProgram';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

type ResponseData = { value: ITrainingProgram[]; '@odata.count': number };

const fetchBasicProgramsRequest = () =>
  ({
    type: 'FETCH_BASIC_PROGRAMS_REQUEST'
  } as const);

const fetchBasicProgramsSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_BASIC_PROGRAMS_SUCCESS',
    payload: data.value
  } as const);

const fetchBasicProgramsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_BASIC_PROGRAMS_FAILURE',
    error
  } as const;
};

const shouldFetchBasicPrograms = ({ programs: { isFetching, basicPrograms } }: RootState) =>
  !isFetching && !basicPrograms;

const fetchBasicPrograms = (): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchBasicProgramsRequest());

      const { data } = await axios.get<ResponseData>('/api/v3.01/programs', {
        params: {
          $filter: "contains(tolower(name),'basic')"
        }
      });

      dispatch(fetchBasicProgramsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchBasicProgramsFailure(error));
      reject(error);
    }
  });

export const fetchBasicProgramsIfNeeded = (): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchBasicPrograms(getState())) {
    dispatch(fetchBasicPrograms());
  }
};

export type Actions =
  | ReturnType<typeof fetchBasicProgramsRequest>
  | ReturnType<typeof fetchBasicProgramsSuccess>
  | ReturnType<typeof fetchBasicProgramsFailure>;
