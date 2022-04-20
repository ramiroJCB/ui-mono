import { Actions as FetchWorkGroupJobTypeContractorsActions } from './actions/fetchWorkGroupJobTypeContractors';
import { Actions as AddWorkGroupJobTypeContractorsActions } from './actions/addWorkGroupJobTypeContractors';
import { Actions as UnassignWorkGroupJobTypeContractorActions } from '../workGroupJobTypeContractor/actions/unassignWorkGroupJobTypeContractor';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  workGroupJobTypeContractors: IOperatorWorkGroupJobTypeContractor[];
  totalCount: number;
  error: AxiosError | null;
}>;

type Actions =
  | FetchWorkGroupJobTypeContractorsActions
  | AddWorkGroupJobTypeContractorsActions
  | UnassignWorkGroupJobTypeContractorActions;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  workGroupJobTypeContractors: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_WORK_GROUP_JOB_TYPE_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        workGroupJobTypeContractors: [],
        totalCount: 0,
        error: null
      };
    case 'ADD_WORK_GROUP_JOB_TYPE_CONTRACTORS_REQUEST':
    case 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTORS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTORS_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        workGroupJobTypeContractors: uniqueById(state.workGroupJobTypeContractors, action.payload).sort((a, b) =>
          a.contractorName.localeCompare(b.contractorName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'UNASSIGN_WORK_GROUP_JOB_TYPE_CONTRACTOR_SUCCESS':
      const workGroupJobTypeContractors = state.workGroupJobTypeContractors.filter(({ id }) => id !== action.payload);
      return {
        ...state,
        workGroupJobTypeContractors,
        totalCount: workGroupJobTypeContractors.length
      };
    case 'ADD_WORK_GROUP_JOB_TYPE_CONTRACTORS_FAILURE':
    case 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTORS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_WORK_GROUP_JOB_TYPE_CONTRACTORS_SUCCESS':
      return {
        ...state,
        workGroupJobTypeContractors: [],
        totalCount: 0
      };
    default:
      return state;
  }
}
