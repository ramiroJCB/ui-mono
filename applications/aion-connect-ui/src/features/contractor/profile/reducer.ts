import { Actions as ToggleViewActions } from './actions';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  viewAsClient: boolean;
}>;

export const initialState: State = {
  viewAsClient: false
};

export function reducer(state: State = initialState, action: ToggleViewActions): State {
  switch (action.type) {
    case 'TOGGLE_VIEW_AS_CLIENT':
      return {
        viewAsClient: !state.viewAsClient
      };
    case 'VIEW_AS_CLIENT':
      return {
        viewAsClient: true
      };
    default:
      return state;
  }
}
