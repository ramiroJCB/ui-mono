import { Actions } from 'actions/searchTrainees';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { ISearchTraineesForm } from 'interfaces/searchTraineesForm';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';

export type State = DeepReadonly<{
  isFetching: boolean;
  searchTrainees: ITraineeWithEmployees[] | null;
  error: AxiosError | Error | null;
  userProvidedInfo: ISearchTraineesForm | null;
}>;

const initialState: State = {
  isFetching: false,
  searchTrainees: null,
  error: null,
  userProvidedInfo: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'SEARCH_TRAINEES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'SEARCH_TRAINEES_SUCCESS':
      return {
        isFetching: false,
        searchTrainees: action.payload,
        error: null,
        userProvidedInfo: action.userProvidedInfo
      };
    case 'SEARCH_TRAINEES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
