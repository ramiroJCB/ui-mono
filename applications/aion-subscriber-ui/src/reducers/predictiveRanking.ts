import { Actions } from 'actions/predictiveRanking';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IPredictiveRanking } from 'interfaces/predictiveRanking';

export type State = DeepReadonly<{
  isFetching: boolean;
  predictiveRanking: IPredictiveRanking[] | null;
  error: AxiosError | null;
}>;

const initialState: State = {
  isFetching: false,
  predictiveRanking: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_PREDICTIVE_RANKING_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_PREDICTIVE_RANKING_SUCCESS':
      return {
        isFetching: false,
        predictiveRanking: action.payload,
        error: null
      };
    case 'FETCH_PREDICTIVE_RANKING_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
