import { createReducer } from '@pec/aion-ui-core/reducers/options';
import { DeepReadonly } from 'utility-types';

export type State = DeepReadonly<{
  questionnaireTileShowCompletedSections: boolean;
  clientScoresTileExpandedOrganizationIds: string[];
  questionnaireLastViewedSectionId: string | null;
}>;

const initialState: State = {
  questionnaireTileShowCompletedSections: false,
  clientScoresTileExpandedOrganizationIds: [],
  questionnaireLastViewedSectionId: null
};

export const reducer = createReducer(initialState);
