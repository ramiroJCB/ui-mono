import { Actions as AddCommentActions } from 'features/comment/actions/addComment';
import { Actions as AddDocumentActions } from 'features/document/actions/addDocument';
import { Actions as AddExceptionActions } from 'features/requirementOverrides/actions/addRequirementOverride';
import { Actions as AddMandateActions } from 'features/mandate/actions/addMandate';
import { Actions as AddQuestionActions } from 'features/question/actions/addQuestion';
import { Actions as AddReferenceActions } from 'features/reference/actions/addReference';
import { Actions as AddSafetyProgramActions } from 'features/safetyProgram/actions/addSafetyProgram';
import { Actions as DeleteCommentActions } from 'features/comment/actions/deleteComment';
import { Actions as DeleteMandateActions } from 'features/mandate/actions/deleteMandate';
import { Actions as DeleteQuestionActions } from 'features/question/actions/deleteQuestion';
import { Actions as DeleteReferenceActions } from 'features/reference/actions/deleteReference';
import { Actions as DeleteRequirementOverrideActions } from 'features/requirementOverrides/actions/deleteRequirementOverride';
import { Actions as DeleteSafetyProgramActions } from 'features/safetyProgram/actions/deleteSafetyProgram';
import { Actions as FetchBusinessUnitsActions } from 'features/businessUnits/actions/fetchBusinessUnits';
import { Actions as FetchClientActions } from 'features/client/actions/fetchClient';
import { Actions as FetchClientsActions } from 'features/clients/actions/fetchClients';
import { Actions as FetchClientServiceRegionActions } from 'features/clientServiceRegions/actions/fetchClientServiceRegions';
import { Actions as FetchCommentsActions } from 'features/comments/actions/fetchComments';
import { Actions as FetchContractorsActions } from 'features/contractors/actions/fetchContractors';
import { Actions as FetchDocumentActions } from 'features/document/actions/fetchDocument';
import { Actions as FetchDocumentsActions } from 'features/documents/actions/fetchDocuments';
import { Actions as FetchFiltersActions } from 'features/filters/actions/fetchFilters';
import { Actions as FetchMandateActions } from 'features/mandate/actions/fetchMandate';
import { Actions as FetchMandatesActions } from 'features/mandates/actions/fetchMandates';
import { Actions as FetchOverrideHistory } from 'features/overrideHistory/actions/fetchOverrideHistory';
import { Actions as FetchQuestionActions } from 'features/question/actions/fetchQuestion';
import { Actions as FetchReferenceActions } from 'features/reference/actions/fetchReference';
import { Actions as FetchReferencesActions } from 'features/references/actions/fetchReferences';
import { Actions as FetchRegionalServicesActions } from 'features/regionalServices/actions/fetchRegionalServices';
import { Actions as FetchRequirementActions } from 'features/requirement/actions/fetchRequirement';
import { Actions as FetchRequirementsActions } from 'features/requirements/actions/fetchRequirements';
import { Actions as FetchRequirementOverrideActions } from 'features/requirementOverrides/actions/fetchRequirementOverrides';
import { Actions as FetchSafetyProgramActions } from 'features/safetyProgram/actions/fetchSafetyProgram';
import { Actions as FetchSafetyProgramsActions } from 'features/safetyPrograms/actions/fetchSafetyPrograms';
import { Actions as UpdateAnswerActions } from 'features/answer/actions/updateAnswer';
import { Actions as UpdateCommentActions } from 'features/comment/actions/updateComment';
import { Actions as UpdateDocumentScaleActions } from 'features/document/actions/updateDocumentScale';
import { Actions as UpdateMandateActions } from 'features/mandate/actions/updateMandate';
import { Actions as UpdateQuestionActions } from 'features/question/actions/updateQuestion';
import { Actions as UpdateRequirementActions } from 'features/requirement/actions/updateRequirement';
import { Actions as UpdateReferenceActions } from 'features/reference/actions/updateReference';
import { Actions as UpdateSafetyProgramActions } from 'features/safetyProgram/actions/updateSafetyProgram';
import { Actions as UpdateGracePeriodPrompted } from 'features/safetyProgram/actions/updateGracePeriodPrompted';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type RootActions =
  | AddCommentActions
  | AddDocumentActions
  | AddExceptionActions
  | AddMandateActions
  | AddQuestionActions
  | AddReferenceActions
  | AddSafetyProgramActions
  | DeleteCommentActions
  | DeleteMandateActions
  | DeleteQuestionActions
  | DeleteReferenceActions
  | DeleteRequirementOverrideActions
  | DeleteSafetyProgramActions
  | FetchBusinessUnitsActions
  | FetchClientActions
  | FetchClientsActions
  | FetchClientServiceRegionActions
  | FetchCommentsActions
  | FetchContractorsActions
  | FetchDocumentActions
  | FetchDocumentsActions
  | FetchFiltersActions
  | FetchMandateActions
  | FetchMandatesActions
  | FetchOverrideHistory
  | FetchQuestionActions
  | FetchReferenceActions
  | FetchReferencesActions
  | FetchRegionalServicesActions
  | FetchRequirementActions
  | FetchRequirementsActions
  | FetchRequirementOverrideActions
  | FetchSafetyProgramActions
  | FetchSafetyProgramsActions
  | UpdateAnswerActions
  | UpdateCommentActions
  | UpdateDocumentScaleActions
  | UpdateMandateActions
  | UpdateQuestionActions
  | UpdateReferenceActions
  | UpdateRequirementActions
  | UpdateSafetyProgramActions
  | UpdateGracePeriodPrompted
  | CommonRootActions;
