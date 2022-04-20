import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import {
  reducer as requirementOverrides,
  State as RequirementOverridesState
} from 'features/requirementOverrides/reducer';
import {
  reducer as clientRequirementOverrides,
  State as ClientRequirementOverridesState
} from 'features/requirementClientOverrides/reducer';

import {
  reducer as clientRequirementOverride,
  State as ClientRequirementOverrideState
} from 'features/requirementClientOverride/reducer';

import { reducer as answer, State as AnswerState } from 'features/answer/reducer';
import { reducer as businessUnits, State as BusinessUnitsState } from 'features/businessUnits/reducer';
import {
  reducer as clientServiceRegions,
  State as ClientServiceRegionsState
} from 'features/clientServiceRegions/reducer';
import { reducer as comments, State as CommentsState } from 'features/comments/reducer';
import { reducer as contractors, State as ContractorsState } from 'features/contractors/reducer';
import { reducer as document, State as DocumentState } from 'features/document/reducer';
import { reducer as documents, State as DocumentsState } from 'features/documents/reducer';
import { reducer as filters, State as FiltersState } from 'features/filters/reducer';
import { reducer as mandate, State as MandateState } from 'features/mandate/reducer';
import { reducer as mandates, State as MandatesState } from 'features/mandates/reducer';
import { reducer as overrideHistory, State as OverrideHistoryState } from 'features/overrideHistory/reducer';
import { reducer as question, State as QuestionState } from 'features/question/reducer';
import { reducer as reference, State as ReferenceState } from 'features/reference/reducer';
import { reducer as references, State as ReferencesState } from 'features/references/reducer';
import { reducer as regionalServices, State as RegionalServicesState } from 'features/regionalServices/reducer';
import { reducer as requirement, State as RequirementState } from 'features/requirement/reducer';
import { reducer as requirements, State as RequirementsState } from 'features/requirements/reducer';
import { reducer as safetyProgram, State as SafetyProgramState } from 'features/safetyProgram/reducer';
import { reducer as safetyProgramClient, State as SafetyProgramClientState } from 'features/client/reducer';
import { reducer as safetyProgramClients, State as SafetyProgramClientsState } from 'features/clients/reducer';
import { reducer as safetyPrograms, State as SafetyProgramsState } from 'features/safetyPrograms/reducer';
import { reducer as shopLinks, State as ShopLinksState } from 'features/shopLinks/reducer';
import { reducer as programStatusData, State as ProgramStatusDataState } from 'features/reports/programStatus/reducer';

import { TypedUseSelectorHook, useSelector } from 'react-redux';

type AppRootState = {
  answer: AnswerState;
  businessUnits: BusinessUnitsState;
  clientRequirementOverride: ClientRequirementOverrideState;
  clientRequirementOverrides: ClientRequirementOverridesState;
  clientServiceRegions: ClientServiceRegionsState;
  comments: CommentsState;
  contractors: ContractorsState;
  document: DocumentState;
  documents: DocumentsState;
  filters: FiltersState;
  mandate: MandateState;
  mandates: MandatesState;
  overrideHistory: OverrideHistoryState;
  programStatusData: ProgramStatusDataState;
  question: QuestionState;
  reference: ReferenceState;
  references: ReferencesState;
  regionalServices: RegionalServicesState;
  requirement: RequirementState;
  requirements: RequirementsState;
  requirementOverrides: RequirementOverridesState;
  safetyProgram: SafetyProgramState;
  safetyProgramClient: SafetyProgramClientState;
  safetyProgramClients: SafetyProgramClientsState;
  safetyPrograms: SafetyProgramsState;
  shopLinks: ShopLinksState;
};

export type RootState = AppRootState & CommonRootState;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const rootReducer = combineReducers<RootState>({
  ...commonRootReducer,
  answer,
  businessUnits,
  clientRequirementOverride,
  clientRequirementOverrides,
  clientServiceRegions,
  comments,
  contractors,
  document,
  documents,
  filters,
  mandate,
  mandates,
  overrideHistory,
  programStatusData,
  question,
  reference,
  references,
  regionalServices,
  requirement,
  requirements,
  requirementOverrides,
  safetyProgram,
  safetyProgramClient,
  safetyProgramClients,
  safetyPrograms,
  shopLinks
});
