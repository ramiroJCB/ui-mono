import { Actions as FetchJobTypeTrainingRequirementActions } from './actions/fetchJobTypeTrainingRequirement';
import { Actions as DeleteJobTypeTrainingRequirementsActions } from './actions/deleteJobTypeTrainingRequirement';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IOperatorJobTypeTrainingRequirement } from 'interfaces/operatorJobTypeTrainingRequirement';

export type State = DeepReadonly<{
  isFetching: boolean;
  operatorJobTypeTrainingRequirement: IOperatorJobTypeTrainingRequirement | null;
  error: AxiosError | null;
}>;

type Actions = FetchJobTypeTrainingRequirementActions | DeleteJobTypeTrainingRequirementsActions;

export const initialState: State = {
  isFetching: false,
  operatorJobTypeTrainingRequirement: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENT_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENT_SUCCESS':
      return {
        isFetching: false,
        operatorJobTypeTrainingRequirement: action.payload,
        error: null
      };
    case 'DELETE_JOB_TYPE_TRAINING_REQUIREMENT_SUCCESS':
      return {
        isFetching: false,
        operatorJobTypeTrainingRequirement: null,
        error: null
      };
    case 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENT_FAILURE':
    case 'DELETE_JOB_TYPE_TRAINING_REQUIREMENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
