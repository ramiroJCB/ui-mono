import { Actions as AddWorkGroupJobTypesActions } from 'features/operator/workGroupJobTypes/actions/addWorkGroupJobTypes';
import { Actions as FetchWorkGroupActions } from 'features/operator/workGroup/actions/fetchWorkGroup';
import { Actions as AddJobTypeTrainingRequirementsActions } from 'features/operator/jobTypeTrainingRequirements/actions/addJobTypeTrainingRequirements';
import { Actions as AddWorkGroupJobTypeContractorsActions } from 'features/operator/workGroupJobTypeContractors/actions/addWorkGroupJobTypeContractors';
import { Actions as AddWorkGroupJobTypeEmployeesActions } from 'features/workGroupJobTypeEmployees/actions/addWorkGroupJobTypeEmployees';
import { Actions as ContractorsActions } from 'features/operator/contractors/actions';
import { Actions as WorkGroupContractorsActions } from 'features/contractor/workGroups/actions';
import { Actions as AddJobTypeActions } from 'features/operator/jobType/actions/addJobType';
import { Actions as EditJobTypeActions } from 'features/operator/jobType/actions/editJobType';
import { Actions as DeleteJobTypeActions } from 'features/operator/jobType/actions/deleteJobType';
import { Actions as JobTypesActions } from 'features/operator/jobTypes/actions';
import { Actions as FetchWorkGroupJobTypesForContractor } from 'features/contractor/workGroupJobTypes/actions';
import { Actions as FetchJobTypeActions } from 'features/operator/jobType/actions/fetchJobType';
import { Actions as FetchAutocompleteContractorActions } from 'features/operator/autocompleteContractors/actions/fetchAutocompleteContractors';
import { Actions as FetchAutocompleteNotAssignedContractors } from 'features/operator/autocompleteContractors/actions/fetchAutocompleteNotAssignedContractors';
import { Actions as FetchAutocompleteContractorForValidationActions } from 'features/operator/autocompleteContractors/actions/fetchAutocompleteContractorsForValidation';
import { Actions as FetchAutocompleteEmployeeActions } from 'features/contractor/autocompleteEmployees/actions/fetchAutocompleteEmployees';
import { Actions as FetchAutocompleteEmployeeForValidationActions } from 'features/contractor/autocompleteEmployees/actions/fetchAutocompleteEmployeesForValidation';
import { Actions as FetchAutocompleteTrainingActions } from 'features/operator/autocompleteTrainings/actions/fetchAutocompleteTrainings';
import { Actions as FetchWorkGroupJobTypeActions } from 'features/workGroupJobType/actions/fetchWorkGroupJobType';
import { Actions as UnassignWorkGroupJobTypeActions } from 'features/workGroupJobType/actions/unassignWorkGroupJobType';
import { Actions as ContractorActions } from 'features/operator/contractor/actions';
import { Actions as FetchAutocompleteTrainingForValidationActions } from 'features/operator/autocompleteTrainings/actions/fetchAutocompleteTrainingsForValidation';
import { Actions as FetchOperatorJobTypeTrainingRequirementsActions } from 'features/operator/jobTypeTrainingRequirements/actions/fetchJobTypeTrainingRequirements';
import { Actions as FetchTrainingActions } from 'features/operator/training/actions/fetchTraining';
import { Actions as FetchClientAssignedEmployeesActions } from 'features/operator/clientAssignedEmployees/actions';
import { Actions as AddWorkGroupActions } from 'features/operator/workGroup/actions/addWorkGroup';
import { Actions as FetchContractorJobTypeTrainingRequirementsActions } from 'features/contractor/jobTypeTrainingRequirements/actions';
import { Actions as EditWorkGroupActions } from 'features/operator/workGroup/actions/editWorkGroup';
import { Actions as UnassignWorkGroupJobTypeContractor } from 'features/operator/workGroupJobTypeContractor/actions/unassignWorkGroupJobTypeContractor';
import { Actions as FetchWorkGroupJobTypesActions } from 'features/operator/workGroupJobTypes/actions/fetchWorkGroupJobTypes';
import { Actions as FetchJobTypeWorkGroupsActions } from 'features/operator/jobTypeWorkGroups/actions';
import { Actions as FetchWorkGroupJobTypeContractorActions } from 'features/operator/workGroupJobTypeContractor/actions/fetchWorkGroupJobTypeContractor';
import { Actions as FetchWorkGroupJobTypeEmployeesActions } from 'features/workGroupJobTypeEmployees/actions/fetchWorkGroupJobTypeEmployees';
import { Actions as FetchWorkGroupJobTypeContractorsActions } from 'features/operator/workGroupJobTypeContractors/actions/fetchWorkGroupJobTypeContractors';
import { Actions as FetchAutocompleteServiceRegionsActions } from 'features/operator/autocompleteServiceRegions/actions/fetchAutocompleteServiceRegions';
import { Actions as FetchAutocompleteJobTypesActions } from 'features/operator/autocompleteJobTypes/actions/fetchAutocompleteJobTypes';
import { Actions as FetchAutocompleteJobTypesForValidationActions } from 'features/operator/autocompleteJobTypes/actions/fetchAutocompleteJobTypesForValidation';
import { Actions as AddTrainingActions } from 'features/operator/training/actions/addTraining';
import { Actions as EditTrainingActions } from 'features/operator/training/actions/editTraining';
import { Actions as DeleteTrainingActions } from 'features/operator/training/actions/deleteTraining';
import { Actions as TrainingsActions } from 'features/operator/trainings/actions';
import { Actions as FetchJobTypeTrainingRequirementActions } from 'features/operator/jobTypeTrainingRequirement/actions/fetchJobTypeTrainingRequirement';
import { Actions as FetchContractorJobTypeTrainingRequirementActions } from 'features/contractor/jobTypeTrainingRequirement/actions';
import { Actions as DeleteJobTypeTrainingRequirementActions } from 'features/operator/jobTypeTrainingRequirement/actions/deleteJobTypeTrainingRequirement';
import { Actions as DeleteWorkGroupActions } from 'features/operator/workGroup/actions/deleteWorkGroup';
import { Actions as FetchWorkGroupJobTypeEmployeeActions } from 'features/workGroupJobTypeEmployee/actions/fetchWorkGroupJobTypeEmployee';
import { Actions as UnassignWorkGroupJobTypeEmployeeActions } from 'features/workGroupJobTypeEmployee/actions/unassignWorkGroupJobTypeEmployee';
import { Actions as FetchWorkGroupJobTypeEmployeeTrainingActions } from 'features/workGroupJobTypeEmployeeTraining/actions';
import { Actions as FetchWorkGroupContractorActions } from 'features/contractor/workGroup/actions';
import { Actions as FetchEmployeeTrainingRequirementActions } from 'features/contractor/employeeTrainingRequirement/actions/fetchEmployeeTrainingRequirement';
import { Actions as FetchClientAssignedEmployeeTrainingRequirementsActions } from 'features/operator/clientAssignedEmployeeTrainingRequirements/actions';
import { Actions as AddEmployeeTrainingRequirementDocumentActions } from 'features/contractor/employeeTrainingRequirement/actions/addEmployeeTrainingRequirementDocument';
import { Actions as DeleteEmployeeTrainingRequirementDocumentActions } from 'features/contractor/employeeTrainingRequirement/actions/deleteEmployeeTrainingRequirementDocument';
import { Actions as DownloadEmployeeTrainingRequirementDocumentActions } from 'features/contractor/employeeTrainingRequirement/actions/downloadEmployeeTrainingRequirementDocument';
import { Actions as EditEmployeeTrainingRequirementActions } from 'features/contractor/employeeTrainingRequirement/actions/editEmployeeTrainingRequirement';
import { Actions as FetchEmployeeActions } from 'features/operator/employee/actions';
import { Actions as FetchContractorEmployeesActions } from 'features/contractorEmployees/actions/contractorEmployees';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type RootActions =
  | AddEmployeeTrainingRequirementDocumentActions
  | AddJobTypeActions
  | AddJobTypeActions
  | AddJobTypeTrainingRequirementsActions
  | AddTrainingActions
  | AddWorkGroupActions
  | AddWorkGroupJobTypesActions
  | AddWorkGroupJobTypeContractorsActions
  | AddWorkGroupJobTypeEmployeesActions
  | CommonRootActions
  | ContractorActions
  | ContractorsActions
  | DeleteJobTypeTrainingRequirementActions
  | DeleteJobTypeActions
  | DeleteWorkGroupActions
  | DeleteTrainingActions
  | DeleteEmployeeTrainingRequirementDocumentActions
  | DownloadEmployeeTrainingRequirementDocumentActions
  | EditEmployeeTrainingRequirementActions
  | EditJobTypeActions
  | EditTrainingActions
  | FetchClientAssignedEmployeesActions
  | FetchAutocompleteContractorActions
  | FetchAutocompleteContractorForValidationActions
  | FetchAutocompleteEmployeeActions
  | FetchAutocompleteEmployeeForValidationActions
  | FetchAutocompleteJobTypesActions
  | FetchAutocompleteJobTypesForValidationActions
  | FetchAutocompleteNotAssignedContractors
  | FetchAutocompleteServiceRegionsActions
  | FetchClientAssignedEmployeeTrainingRequirementsActions
  | FetchContractorJobTypeTrainingRequirementActions
  | FetchContractorJobTypeTrainingRequirementsActions
  | FetchEmployeeActions
  | FetchEmployeeTrainingRequirementActions
  | FetchWorkGroupJobTypeEmployeeActions
  | UnassignWorkGroupJobTypeEmployeeActions
  | EditWorkGroupActions
  | FetchAutocompleteTrainingActions
  | FetchAutocompleteTrainingForValidationActions
  | FetchJobTypeActions
  | FetchJobTypeTrainingRequirementActions
  | FetchOperatorJobTypeTrainingRequirementsActions
  | FetchWorkGroupJobTypeContractorActions
  | FetchWorkGroupJobTypeContractorsActions
  | FetchWorkGroupJobTypeEmployeesActions
  | FetchWorkGroupJobTypeActions
  | FetchJobTypeWorkGroupsActions
  | FetchWorkGroupJobTypesActions
  | FetchWorkGroupContractorActions
  | FetchWorkGroupJobTypesForContractor
  | FetchWorkGroupActions
  | FetchWorkGroupJobTypeEmployeeTrainingActions
  | FetchWorkGroupJobTypeActions
  | FetchTrainingActions
  | JobTypesActions
  | TrainingsActions
  | UnassignWorkGroupJobTypeActions
  | UnassignWorkGroupJobTypeContractor
  | WorkGroupContractorsActions
  | FetchContractorEmployeesActions;
