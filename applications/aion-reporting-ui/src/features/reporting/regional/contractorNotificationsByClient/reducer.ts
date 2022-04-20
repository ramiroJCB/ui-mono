import { Actions } from './actions';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  [clientId: string]: {
    flexTrack: number | null;
  };
}>;

export const initialState: State = {};
export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_FLEXTRACK_NOTIFICATIONS_COUNT_BY_CLIENT_SUCCESS':
      return {
        ...state,
        [action.clientId]: {
          flexTrack: action.flexTrackNotificationsCount
        }
      };
    default:
      return state;
  }
}
