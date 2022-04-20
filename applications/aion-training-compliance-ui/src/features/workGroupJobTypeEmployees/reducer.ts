import { Actions as FetchWorkGroupJobTypeEmployeesActions } from './actions/fetchWorkGroupJobTypeEmployees';
import { Actions as AddWorkGroupJobTypeEmployeesActions } from './actions/addWorkGroupJobTypeEmployees';
import { Actions as FetchWorkGroupJobTypeContractorActions } from 'features/operator/workGroupJobTypeContractor/actions/fetchWorkGroupJobTypeContractor';
import { Actions as UnassignWorkGroupJobTypeEmployeeActions } from 'features/workGroupJobTypeEmployee/actions/unassignWorkGroupJobTypeEmployee';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  workGroupJobTypeEmployees: IWorkGroupJobTypeEmployee[];
  totalCount: number;
  error: AxiosError | null;
}>;

type Actions =
  | FetchWorkGroupJobTypeEmployeesActions
  | AddWorkGroupJobTypeEmployeesActions
  | FetchWorkGroupJobTypeContractorActions
  | UnassignWorkGroupJobTypeEmployeeActions;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  workGroupJobTypeEmployees: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTOR_REQUEST':
    case 'FETCH_INITIAL_WORK_GROUP_JOB_TYPE_EMPLOYEES_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        workGroupJobTypeEmployees: [],
        totalCount: 0,
        error: null
      };
    case 'ADD_WORK_GROUP_JOB_TYPE_EMPLOYEES_REQUEST':
    case 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEES_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        workGroupJobTypeEmployees: uniqueById(state.workGroupJobTypeEmployees, action.payload).sort((a, b) =>
          a.employeeName.localeCompare(b.employeeName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'UNASSIGN_WORK_GROUP_JOB_TYPE_EMPLOYEE_SUCCESS':
      const workGroupJobTypeEmployees = state.workGroupJobTypeEmployees.filter(({ id }) => id !== action.payload);
      return {
        ...state,
        workGroupJobTypeEmployees,
        totalCount: workGroupJobTypeEmployees.length
      };
    case 'ADD_WORK_GROUP_JOB_TYPE_EMPLOYEES_FAILURE':
    case 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_WORK_GROUP_JOB_TYPE_EMPLOYEES_SUCCESS':
      return {
        ...state,
        workGroupJobTypeEmployees: [],
        totalCount: 0
      };
    default:
      return state;
  }
}
