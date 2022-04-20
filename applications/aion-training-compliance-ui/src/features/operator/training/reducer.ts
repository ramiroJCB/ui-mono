import { Actions as FetchTrainingActions } from './actions/fetchTraining';
import { Actions as AddTrainingActions } from './actions/addTraining';
import { Actions as EditTrainingActions } from './actions/editTraining';
import { Actions as DeleteTrainingActions } from './actions/deleteTraining';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';

export type State = DeepReadonly<{
  isFetching: boolean;
  training: ITrainingRequirement | null;
  error: AxiosError | null;
}>;

type Actions = FetchTrainingActions | AddTrainingActions | EditTrainingActions | DeleteTrainingActions;

export const initialState: State = {
  isFetching: false,
  training: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_TRAINING_REQUEST':
    case 'FETCH_TRAINING_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'DELETE_TRAINING_SUCCESS':
      return {
        isFetching: false,
        training: null,
        error: null
      };
    case 'ADD_TRAINING_SUCCESS':
    case 'FETCH_TRAINING_SUCCESS':
    case 'EDIT_TRAINING_SUCCESS':
      return {
        isFetching: false,
        training: action.payload,
        error: null
      };
    case 'ADD_TRAINING_FAILURE':
    case 'FETCH_TRAINING_FAILURE':
    case 'EDIT_TRAINING_FAILURE':
    case 'DELETE_TRAINING_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
