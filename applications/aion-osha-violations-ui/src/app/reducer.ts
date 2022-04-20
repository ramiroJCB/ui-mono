import { AppDispatch, RootState } from './store';
import { associatedViolationsReducer } from 'features/specialist/verificationSpecialist/associatedViolations/slice';
import { commonRootReducer } from '@pec/aion-ui-core/combineReducers';
import { organizationsViolationReducer } from 'features/specialist/violationDetails/organizationViolations/slice';
import { organizationViolationReducer } from 'features/specialist/violationDetails/organizationViolation/slice';
import { oshaImportReducer } from 'features/specialist/verificationSpecialist/oshaImports/slice';
import { oshaViolationReducer } from 'features/specialist/violationDetails/oshaViolation/slice';
import { pendingViolationsReducer } from 'features/specialist/verificationSpecialist/pendingViolations/slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { unassociatedViolationsReducer } from 'features/specialist/verificationSpecialist/unassociatedViolations/slice';
import { unMatchedViolationsReducer } from 'features/specialist/verificationSpecialist/unMatchedViolations/slice';
import { updatedViolationReducer } from 'features/specialist/violationDetails/updateViolation/slice';
import { violationMatchRecordsReducer } from 'features/specialist/violationDetails/violationMatchRecords/slice';
import { contractorViolationsCountReducer } from 'features/contractor/contractorViolationsCount/slice';
import { contractorViolationsReducer } from 'features/contractor/contractorViolations/slice';
import { clientViolationsReducer } from 'features/client/clientViolations/slice';
import { contractorImportsReducer } from 'features/contractor/contractorImports/slice';
import { clientOrganizationsReducer } from 'features/client/clientOrganizations/slice';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const reducer = {
  ...commonRootReducer,
  associatedViolations: associatedViolationsReducer,
  pendingViolations: pendingViolationsReducer,
  unassociatedViolations: unassociatedViolationsReducer,
  unMatchedViolations: unMatchedViolationsReducer,
  organizationViolation: organizationViolationReducer,
  organizationViolations: organizationsViolationReducer,
  oshaViolation: oshaViolationReducer,
  oshaImport: oshaImportReducer,
  updatedViolation: updatedViolationReducer,
  violationRecords: violationMatchRecordsReducer,
  contractorViolationsCount: contractorViolationsCountReducer,
  contractorViolations: contractorViolationsReducer,
  clientViolations: clientViolationsReducer,
  contractorImports: contractorImportsReducer,
  clientOrganizations: clientOrganizationsReducer
};
