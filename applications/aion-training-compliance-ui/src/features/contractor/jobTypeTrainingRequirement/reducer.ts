import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IContractorJobTypeTrainingRequirement } from 'interfaces/contractorJobTypeTrainingRequirement';

export type State = DeepReadonly<{
  isFetching: boolean;
  contractorJobTypeTrainingRequirement: IContractorJobTypeTrainingRequirement | null;
  error: AxiosError | null;
}>;

export const initialState: State = {
  isFetching: false,
  contractorJobTypeTrainingRequirement: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENT_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENT_SUCCESS':
      return {
        ...state,
        isFetching: false,
        contractorJobTypeTrainingRequirement: action.payload,
        error: null
      };
    case 'FETCH_CONTRACTOR_JOB_TYPE_TRAINING_REQUIREMENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
