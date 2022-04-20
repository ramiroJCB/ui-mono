import {
  assignedEmployeeReportReducer,
  initialState as assignedEmployeeReportInitialState
} from 'features/operator/assignedEmployeeReport/slice';
import {
  autocompleteClientAssignedEmployeesReducer,
  initialState as autocompleteClientAssignedEmployeesInitialState
} from 'features/operator/autocompleteClientAssignedEmployees/slice';
import {
  autocompleteWorkGroupsReducer,
  initialState as autocompleteWorkGroupsInitialState
} from 'features/operator/autocompleteWorkGroups/slice';
import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import {
  reducer as workGroupContractor,
  State as WorkGroupContractorState
} from 'features/contractor/workGroup/reducer';
import {
  reducer as contractorJobTypeTrainingRequirements,
  State as ContractorJobTypeTrainingRequirementsState
} from 'features/contractor/jobTypeTrainingRequirements/reducer';
import { reducer as workGroups, State as WorkGroupsState } from 'features/operator/workGroups/reducer';
import { reducer as jobTypes, State as JobTypesState } from 'features/operator/jobTypes/reducer';
import { reducer as contractor, State as ContractorState } from 'features/operator/contractor/reducer';
import { reducer as contractors, State as ContractorsState } from 'features/operator/contractors/reducer';
import {
  reducer as contractorWorkGroupJobTypes,
  State as ContractorWorkGroupJobTypesState
} from 'features/contractor/workGroupJobTypes/reducer';
import { reducer as training, State as TrainingState } from 'features/operator/training/reducer';
import { reducer as trainings, State as TrainingsState } from 'features/operator/trainings/reducer';
import { reducer as jobType, State as JobTypeState } from 'features/operator/jobType/reducer';
import { reducer as workGroupJobType, State as WorkGroupJobTypeState } from 'features/workGroupJobType/reducer';
import {
  reducer as clientAssignedEmployees,
  State as ClientAssignedEmployeesState
} from 'features/operator/clientAssignedEmployees/reducer';
import {
  reducer as clientAssignedEmployeeTrainingRequirements,
  State as ClientAssignedEmployeeTrainingRequirementsState
} from 'features/operator/clientAssignedEmployeeTrainingRequirements/reducer';
import {
  reducer as workGroupJobTypeContractor,
  State as WorkGroupJobTypeContractorState
} from 'features/operator/workGroupJobTypeContractor/reducer';
import {
  reducer as workGroupJobTypeContractors,
  State as WorkGroupJobTypeContractorsState
} from 'features/operator/workGroupJobTypeContractors/reducer';
import {
  reducer as autocompleteEmployees,
  State as AutocompleteEmployeesState
} from 'features/contractor/autocompleteEmployees/reducer';
import {
  reducer as jobTypeWorkGroups,
  State as JobTypeWorkGroupsState
} from 'features/operator/jobTypeWorkGroups/reducer';
import {
  reducer as operatorJobTypeTrainingRequirements,
  State as OperatorJobTypeTrainingRequirementsState
} from 'features/operator/jobTypeTrainingRequirements/reducer';
import {
  reducer as workGroupContractors,
  State as WorkGroupContractorsState
} from 'features/contractor/workGroups/reducer';
import {
  reducer as operatorJobTypeTrainingRequirement,
  State as OperatorJobTypeTrainingRequirementState
} from 'features/operator/jobTypeTrainingRequirement/reducer';
import {
  reducer as contractorJobTypeTrainingRequirement,
  State as ContractorJobTypeTrainingRequirementState
} from 'features/contractor/jobTypeTrainingRequirement/reducer';
import { reducer as workGroup, State as WorkGroupState } from 'features/operator/workGroup/reducer';
import {
  reducer as employeeTrainingRequirement,
  State as EmployeeTrainingRequirementState
} from 'features/contractor/employeeTrainingRequirement/reducer';
import { reducer as employee, State as EmployeeState } from 'features/operator/employee/reducer';
import {
  reducer as workGroupJobTypes,
  State as WorkGroupJobTypesState
} from 'features/operator/workGroupJobTypes/reducer';
import {
  reducer as autocompleteTrainings,
  State as AutocompleteTrainingsState
} from 'features/operator/autocompleteTrainings/reducer';
import {
  reducer as autocompleteServiceRegions,
  State as AutocompleteServiceRegionsState
} from 'features/operator/autocompleteServiceRegions/reducer';
import {
  reducer as autocompleteJobTypes,
  State as AutocompleteJobTypesState
} from 'features/operator/autocompleteJobTypes/reducer';
import {
  reducer as workGroupJobTypeEmployee,
  State as WorkGroupJobTypeEmployeeState
} from 'features/workGroupJobTypeEmployee/reducer';
import {
  reducer as workGroupJobTypeEmployeeTraining,
  State as WorkGroupJobTypeEmployeeTrainingState
} from 'features/workGroupJobTypeEmployeeTraining/reducer';
import {
  reducer as workGroupJobTypeEmployees,
  State as WorkGroupJobTypeEmployeesState
} from 'features/workGroupJobTypeEmployees/reducer';
import {
  reducer as autocompleteContractors,
  State as AutocompleteContractorsState
} from 'features/operator/autocompleteContractors/reducer';
import {
  reducer as contractorEmployees,
  State as ContractorEmployeesState
} from 'features/contractorEmployees/reducer';
import { RootActions } from 'combineActions';

type AppRootState = {
  assignedEmployeeReport: typeof assignedEmployeeReportInitialState;
  autocompleteClientAssignedEmployees: typeof autocompleteClientAssignedEmployeesInitialState;
  autocompleteContractors: AutocompleteContractorsState;
  autocompleteEmployees: AutocompleteEmployeesState;
  autocompleteJobTypes: AutocompleteJobTypesState;
  autocompleteServiceRegions: AutocompleteServiceRegionsState;
  autocompleteTrainings: AutocompleteTrainingsState;
  autocompleteWorkGroups: typeof autocompleteWorkGroupsInitialState;
  clientAssignedEmployees: ClientAssignedEmployeesState;
  contractor: ContractorState;
  contractorJobTypeTrainingRequirement: ContractorJobTypeTrainingRequirementState;
  contractorJobTypeTrainingRequirements: ContractorJobTypeTrainingRequirementsState;
  contractorEmployees: ContractorEmployeesState;
  contractors: ContractorsState;
  contractorWorkGroupJobTypes: ContractorWorkGroupJobTypesState;
  employee: EmployeeState;
  employeeTrainingRequirement: EmployeeTrainingRequirementState;
  clientAssignedEmployeeTrainingRequirements: ClientAssignedEmployeeTrainingRequirementsState;
  jobTypes: JobTypesState;
  jobType: JobTypeState;
  jobTypeWorkGroups: JobTypeWorkGroupsState;
  operatorJobTypeTrainingRequirement: OperatorJobTypeTrainingRequirementState;
  operatorJobTypeTrainingRequirements: OperatorJobTypeTrainingRequirementsState;
  training: TrainingState;
  trainings: TrainingsState;
  workGroupJobType: WorkGroupJobTypeState;
  workGroupJobTypes: WorkGroupJobTypesState;
  workGroupJobTypeContractor: WorkGroupJobTypeContractorState;
  workGroupJobTypeContractors: WorkGroupJobTypeContractorsState;
  workGroupJobTypeEmployee: WorkGroupJobTypeEmployeeState;
  workGroupJobTypeEmployees: WorkGroupJobTypeEmployeesState;
  workGroupJobTypeEmployeeTraining: WorkGroupJobTypeEmployeeTrainingState;
  workGroup: WorkGroupState;
  workGroups: WorkGroupsState;
  workGroupContractor: WorkGroupContractorState;
  workGroupContractors: WorkGroupContractorsState;
};

export type RootState = AppRootState & CommonRootState;

export const rootReducer = combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  assignedEmployeeReport: assignedEmployeeReportReducer,
  autocompleteClientAssignedEmployees: autocompleteClientAssignedEmployeesReducer,
  autocompleteContractors,
  autocompleteEmployees,
  autocompleteJobTypes,
  autocompleteServiceRegions,
  autocompleteTrainings,
  autocompleteWorkGroups: autocompleteWorkGroupsReducer,
  clientAssignedEmployees,
  clientAssignedEmployeeTrainingRequirements,
  contractor,
  contractorJobTypeTrainingRequirement,
  contractorJobTypeTrainingRequirements,
  contractors,
  contractorWorkGroupJobTypes,
  employee,
  employeeTrainingRequirement,
  jobType,
  jobTypes,
  jobTypeWorkGroups,
  operatorJobTypeTrainingRequirement,
  operatorJobTypeTrainingRequirements,
  training,
  trainings,
  workGroupJobType,
  workGroupJobTypes,
  workGroupJobTypeContractor,
  workGroupJobTypeContractors,
  workGroupJobTypeEmployee,
  workGroupJobTypeEmployees,
  workGroupJobTypeEmployeeTraining,
  workGroup,
  workGroups,
  workGroupContractor,
  workGroupContractors,
  contractorEmployees
});
