import { Actions as TrainingClassActions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ITrainingClass } from '@pec/aion-ui-core/interfaces/trainingClass';

export type State = DeepReadonly<{
  isFetching: boolean;
  trainingClass: ITrainingClass | null;
  error: AxiosError | null;
}>;

type Actions = TrainingClassActions;

const initialState: State = {
  isFetching: false,
  trainingClass: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TRAINING_CLASS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_TRAINING_CLASS_SUCCESS':
      return {
        isFetching: false,
        trainingClass: action.payload,
        error: null
      };
    case 'FETCH_TRAINING_CLASS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
