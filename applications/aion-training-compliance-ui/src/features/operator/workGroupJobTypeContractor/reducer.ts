import { Actions as FetchWorkGroupJobTypeContractorActions } from './actions/fetchWorkGroupJobTypeContractor';
import { Actions as UnassignWorkGroupJobTypeContractorActions } from './actions/unassignWorkGroupJobTypeContractor';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';

export type State = DeepReadonly<{
  isFetching: boolean;
  workGroupJobTypeContractor: IOperatorWorkGroupJobTypeContractor | null;
  fetchError: AxiosError | null;
  unassignError: AxiosError | null;
}>;

type Actions = FetchWorkGroupJobTypeContractorActions | UnassignWorkGroupJobTypeContractorActions;

export const initialState: State = {
  isFetching: false,
  workGroupJobTypeContractor: null,
  fetchError: null,
  unassignError: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTOR_REQUEST':
      return {
        ...state,
        isFetching: true,
        fetchError: null
      };
    case 'UNASSIGN_WORK_GROUP_JOB_TYPE_CONTRACTOR_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupJobTypeContractor: null,
        unassignError: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTOR_SUCCESS':
      return {
        ...state,
        isFetching: false,
        workGroupJobTypeContractor: action.payload,
        fetchError: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTOR_FAILURE':
      return {
        ...state,
        isFetching: false,
        fetchError: action.error
      };
    case 'UNASSIGN_WORK_GROUP_JOB_TYPE_CONTRACTOR_FAILURE':
      return {
        ...state,
        isFetching: false,
        unassignError: action.error
      };
    default:
      return state;
  }
}
