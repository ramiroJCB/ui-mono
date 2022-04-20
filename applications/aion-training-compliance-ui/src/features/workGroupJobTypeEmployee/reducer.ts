import { Actions as FetchWorkGroupJobTypeEmployeeActions } from './actions/fetchWorkGroupJobTypeEmployee';
import { Actions as UnassignWorkGroupJobTypeEmployeeActions } from './actions/unassignWorkGroupJobTypeEmployee';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';

export type State = DeepReadonly<{
  isFetching: boolean;
  workGroupJobTypeEmployee: IWorkGroupJobTypeEmployee | null;
  fetchError: AxiosError | null;
  unassignError: AxiosError | null;
}>;

type Actions = FetchWorkGroupJobTypeEmployeeActions | UnassignWorkGroupJobTypeEmployeeActions;

export const initialState: State = {
  isFetching: false,
  workGroupJobTypeEmployee: null,
  fetchError: null,
  unassignError: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_REQUEST':
      return {
        ...state,
        isFetching: true,
        fetchError: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupJobTypeEmployee: action.payload,
        fetchError: null
      };
    case 'UNASSIGN_WORK_GROUP_JOB_TYPE_EMPLOYEE_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupJobTypeEmployee: null,
        unassignError: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEE_FAILURE':
      return {
        ...state,
        isFetching: false,
        fetchError: action.error
      };
    case 'UNASSIGN_WORK_GROUP_JOB_TYPE_EMPLOYEE_FAILURE':
      return {
        ...state,
        isFetching: false,
        unassignError: action.error
      };
    default:
      return state;
  }
}
