import { Actions as WorkGroupJobTypesActions } from './actions';
import { Actions as WorkGroupActions } from 'features/contractor/workGroup/actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IContractorWorkGroupJobType } from 'interfaces/contractorWorkGroupJobType';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetching: boolean;
  isFetchingInitial: boolean;
  contractorWorkGroupJobTypes: IContractorWorkGroupJobType[];
  totalCount: number;
  error: AxiosError | null;
}>;

type Actions = WorkGroupJobTypesActions | WorkGroupActions;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  contractorWorkGroupJobTypes: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_WORK_GROUP_CONTRACTOR_REQUEST':
    case 'FETCH_INITIAL_CONTRACTOR_WORK_GROUP_JOB_TYPES_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        contractorWorkGroupJobTypes: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_CONTRACTOR_WORK_GROUP_JOB_TYPES_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CONTRACTOR_WORK_GROUP_JOB_TYPES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        isFetchingInitial: false,
        contractorWorkGroupJobTypes: uniqueById(state.contractorWorkGroupJobTypes, action.payload).sort((a, b) =>
          a.jobTypeName.localeCompare(b.jobTypeName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_CONTRACTOR_WORK_GROUP_JOB_TYPES_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
