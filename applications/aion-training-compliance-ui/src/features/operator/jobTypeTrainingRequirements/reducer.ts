import { Actions as FetchJobTypeTrainingRequirementsActions } from './actions/fetchJobTypeTrainingRequirements';
import { Actions as AddJobTypeTrainingRequirementsActions } from './actions/addJobTypeTrainingRequirements';
import { Actions as DeleteJobTypeTrainingRequirementActions } from '../jobTypeTrainingRequirement/actions/deleteJobTypeTrainingRequirement';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IOperatorJobTypeTrainingRequirement } from 'interfaces/operatorJobTypeTrainingRequirement';
import { uniqueById } from 'helpers/uniqueById';

export type State = DeepReadonly<{
  isFetchingInitial: boolean;
  isFetching: boolean;
  operatorJobTypeTrainingRequirements: IOperatorJobTypeTrainingRequirement[];
  totalCount: number;
  error: AxiosError | null;
}>;

type Actions =
  | FetchJobTypeTrainingRequirementsActions
  | AddJobTypeTrainingRequirementsActions
  | DeleteJobTypeTrainingRequirementActions;

export const initialState: State = {
  isFetchingInitial: false,
  isFetching: false,
  operatorJobTypeTrainingRequirements: [],
  totalCount: 0,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_INITIAL_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST':
      return {
        ...state,
        isFetchingInitial: true,
        operatorJobTypeTrainingRequirements: [],
        totalCount: 0,
        error: null
      };
    case 'ADD_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST':
    case 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENTS_SUCCESS':
      return {
        isFetchingInitial: false,
        isFetching: false,
        operatorJobTypeTrainingRequirements: uniqueById(state.operatorJobTypeTrainingRequirements, action.payload).sort(
          (a, b) => a.trainingRequirementName.localeCompare(b.trainingRequirementName)
        ),
        totalCount: action.totalCount,
        error: null
      };
    case 'ADD_JOB_TYPE_TRAINING_REQUIREMENTS_FAILURE':
    case 'FETCH_OPERATOR_JOB_TYPE_TRAINING_REQUIREMENTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_JOB_TYPE_TRAINING_REQUIREMENTS_SUCCESS':
    case 'DELETE_JOB_TYPE_TRAINING_REQUIREMENT_SUCCESS':
      return {
        ...state,
        operatorJobTypeTrainingRequirements: [],
        totalCount: 0
      };
    default:
      return state;
  }
}
