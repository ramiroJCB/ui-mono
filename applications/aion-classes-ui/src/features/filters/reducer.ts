import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ITrainingProgram } from '@pec/aion-ui-core/interfaces/trainingProgram';
import { ITrainingProvider } from '@pec/aion-ui-core/interfaces/trainingProvider';

export type State = DeepReadonly<{
  isFetching: boolean;
  filters: {
    programs: ITrainingProgram[];
    providers: ITrainingProvider[];
  } | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  filters: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_FILTERS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_FILTERS_SUCCESS':
      return {
        isFetching: false,
        filters: action.payload,
        error: null
      };
    case 'FETCH_FILTERS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
