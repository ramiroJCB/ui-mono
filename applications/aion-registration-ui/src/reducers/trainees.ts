import { AxiosError } from 'axios';
import { ITrainee } from '../interfaces/trainee';
import { TraineesActions as Actions } from '../combineActions';

export const FETCH_TRAINEES_REQUEST = 'FETCH_TRAINEES_REQUEST';
export const FETCH_TRAINEES_SUCCESS = 'FETCH_TRAINEES_SUCCESS';
export const FETCH_TRAINEES_FAILURE = 'FETCH_TRAINEES_FAILURE';

export type State = {
  readonly error: AxiosError | Error | null;
  readonly isFetching: boolean;
  readonly trainees: ITrainee[] | null;
  readonly lastFetchedPecId: string | null;
};

const initialState: State = {
  error: null,
  isFetching: false,
  trainees: null,
  lastFetchedPecId: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case FETCH_TRAINEES_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case FETCH_TRAINEES_SUCCESS:
      return {
        ...state,
        error: null,
        isFetching: false,
        trainees: action.payload,
        lastFetchedPecId: action.lastFetchedPecId
      };
    case FETCH_TRAINEES_FAILURE:
      return {
        ...state,
        error: action.error,
        isFetching: false,
        lastFetchedPecId: action.lastFetchedPecId
      };
    default:
      return state;
  }
}
