import { Actions } from 'actions/report';
import { AxiosError } from 'axios';
import { IWorkerDetail } from 'interfaces/workerDetail';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  isFetching: boolean;
  report: IWorkerDetail[] | null;
  error: AxiosError | Error | null;
  totalCount: number;
}>;

const initialState: State = {
  isFetching: false,
  report: null,
  error: null,
  totalCount: 0
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_REPORT_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_REPORT_SUCCESS':
      return {
        ...state,
        isFetching: false,
        report: action.payload,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_REPORT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
