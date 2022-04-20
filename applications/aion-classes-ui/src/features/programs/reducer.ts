import { Actions as FetchProgramsActions } from './actions/fetchPrograms';
import { Actions as FetchBasicProgramsActions } from './actions/fetchBasicPrograms';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ITrainingProgram } from '@pec/aion-ui-core/interfaces/trainingProgram';

export type State = DeepReadonly<{
  isFetching: boolean;
  programs: ITrainingProgram[] | null;
  basicPrograms: ITrainingProgram[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

type Actions = FetchBasicProgramsActions | FetchProgramsActions;

export const initialState: State = {
  isFetching: false,
  programs: null,
  basicPrograms: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_PROGRAMS_REQUEST':
    case 'FETCH_BASIC_PROGRAMS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_BASIC_PROGRAMS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        basicPrograms: action.payload,
        error: null
      };
    case 'FETCH_PROGRAMS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        programs: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_PROGRAMS_FAILURE':
    case 'FETCH_BASIC_PROGRAMS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
