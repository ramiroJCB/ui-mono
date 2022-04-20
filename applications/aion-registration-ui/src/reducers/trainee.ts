import { AxiosError } from 'axios';
import { ITrainee } from '../interfaces/trainee';
import { TraineeActions as Actions } from '../combineActions';

export const ADD_TRAINEE_REQUEST = 'ADD_TRAINEE_REQUEST';
export const ADD_TRAINEE_SUCCESS = 'ADD_TRAINEE_SUCCESS';
export const ADD_TRAINEE_FAILURE = 'ADD_TRAINEE_FAILURE';
export const FETCH_TRAINEE_REQUEST = 'FETCH_TRAINEE_REQUEST';
export const FETCH_TRAINEE_SUCCESS = 'FETCH_TRAINEE_SUCCESS';
export const FETCH_TRAINEE_FAILURE = 'FETCH_TRAINEE_FAILURE';
export const UPDATE_TRAINEE_REQUEST = 'UPDATE_TRAINEE_REQUEST';
export const UPDATE_TRAINEE_SUCCESS = 'UPDATE_TRAINEE_SUCCESS';
export const UPDATE_TRAINEE_FAILURE = 'UPDATE_TRAINEE_FAILURE';

export type State = {
  readonly isFetching: boolean;
  readonly trainee: ITrainee | null;
  readonly error: AxiosError | null;
};

const initialState: State = {
  isFetching: false,
  trainee: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case ADD_TRAINEE_REQUEST:
    case FETCH_TRAINEE_REQUEST:
    case UPDATE_TRAINEE_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ADD_TRAINEE_SUCCESS:
    case FETCH_TRAINEE_SUCCESS:
    case UPDATE_TRAINEE_SUCCESS:
      return {
        isFetching: false,
        trainee: action.payload,
        error: null
      };
    case ADD_TRAINEE_FAILURE:
    case FETCH_TRAINEE_FAILURE:
    case UPDATE_TRAINEE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
