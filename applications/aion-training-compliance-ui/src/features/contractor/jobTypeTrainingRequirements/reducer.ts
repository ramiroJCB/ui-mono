import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IContractorJobTypeTrainingRequirement } from 'interfaces/contractorJobTypeTrainingRequirement';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  contractorJobTypeTrainingRequirements: IContractorJobTypeTrainingRequirement[];
  totalCount: number;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  contractorJobTypeTrainingRequirements: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        contractorJobTypeTrainingRequirements: [],
        totalCount: 0,
        error: null
      };
    case 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENTS_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        contractorJobTypeTrainingRequirements: uniqueById(
          state.contractorJobTypeTrainingRequirements,
          action.payload
        ).sort((a, b) => a.trainingRequirementName.localeCompare(b.trainingRequirementName)),
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
