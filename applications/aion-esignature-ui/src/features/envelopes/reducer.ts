import { Actions as FetchEnvelopesActions } from './actions/fetchEnvelopes';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';

export type State = DeepReadonly<{
  isFetching: boolean;
  envelopes: IEnvelope[];
  totalCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  envelopes: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: FetchEnvelopesActions): State {
  switch (action.type) {
    case 'FETCH_ENVELOPES_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_ENVELOPES_SUCCESS':
      return {
        isFetching: false,
        envelopes: action.payload,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_ENVELOPES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
