import { Actions as TrainingClassesActions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ITrainingClass } from '@pec/aion-ui-core/interfaces/trainingClass';

export type State = DeepReadonly<{
  readonly isFetching: boolean;
  readonly totalCount: number | null;
  readonly trainingClasses: ITrainingClass[] | null;
  readonly error: AxiosError | null;
}>;

type Actions = TrainingClassesActions;

const initialState: State = {
  isFetching: false,
  totalCount: null,
  trainingClasses: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TRAINING_CLASSES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_TRAINING_CLASSES_SUCCESS':
      return {
        isFetching: false,
        totalCount: action.totalCount,
        trainingClasses: action.payload,
        error: null
      };
    case 'FETCH_TRAINING_CLASSES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
