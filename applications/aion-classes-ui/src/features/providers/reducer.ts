import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ITrainingProvider } from '@pec/aion-ui-core/interfaces/trainingProvider';

export type State = DeepReadonly<{
  isFetching: boolean;
  providers: ITrainingProvider[] | null;
  total: number | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  providers: null,
  total: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_PROVIDERS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_PROVIDERS_SUCCESS':
      return {
        isFetching: false,
        providers: action.payload,
        total: action.total,
        error: null
      };
    case 'FETCH_PROVIDERS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
