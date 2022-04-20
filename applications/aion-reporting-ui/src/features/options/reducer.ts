import { createReducer } from '@pec/aion-ui-core/reducers/options';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  showInactiveTypes: boolean;
  showInactiveCategories: boolean;
  showInactiveRegions: boolean;
  showInactiveWorkGroups: boolean;
  showInactiveRootCauses: boolean;
}>;

const initialState: State = {
  showInactiveTypes: false,
  showInactiveCategories: false,
  showInactiveRegions: false,
  showInactiveWorkGroups: false,
  showInactiveRootCauses: false
};

export const reducer = createReducer(initialState);
