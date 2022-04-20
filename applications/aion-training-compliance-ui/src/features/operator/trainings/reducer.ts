import { Actions as FetchTrainingsActions } from './actions';
import { Actions as AddTrainingActions } from '../training/actions/addTraining';
import { Actions as EditTrainingActions } from '../training/actions/editTraining';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  trainings: ITrainingRequirement[];
  totalCount: number;
  error: AxiosError | null;
}>;

type Actions = FetchTrainingsActions | AddTrainingActions | EditTrainingActions;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  trainings: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_TRAININGS_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        trainings: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_TRAININGS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_TRAININGS_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        trainings: uniqueById(state.trainings, action.payload).sort((a, b) => a.name.localeCompare(b.name)),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_TRAININGS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_TRAINING_SUCCESS':
    case 'EDIT_TRAINING_SUCCESS':
      return {
        ...state,
        trainings: []
      };
    default:
      return state;
  }
}
