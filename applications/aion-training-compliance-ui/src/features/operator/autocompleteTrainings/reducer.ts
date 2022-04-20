import { Actions as FetchAutocompleteTrainingsAction } from './actions/fetchAutocompleteTrainings';
import { Actions as FetchAutocompleteTrainingsForValidationAction } from './actions/fetchAutocompleteTrainingsForValidation';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IJobTypeTrainingRequirement } from 'interfaces/jobTypeTrainingRequirement';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';

export type State = DeepReadonly<{
  isFetching: boolean;
  autocompleteTrainings: ITrainingRequirement[];
  jobTypeTrainingRequirements: IJobTypeTrainingRequirement[];
  totalCount: number;
  error: AxiosError | null;
  currentPage: number;
}>;

type Actions = FetchAutocompleteTrainingsAction | FetchAutocompleteTrainingsForValidationAction;

export const initialState: State = {
  isFetching: false,
  autocompleteTrainings: [],
  jobTypeTrainingRequirements: [],
  totalCount: 0,
  currentPage: 1,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_AUTOCOMPLETE_TRAININGS_REQUEST':
    case 'FETCH_AUTOCOMPLETE_TRAININGS_FOR_VALIDATION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_TRAININGS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        autocompleteTrainings: action.payload,
        totalCount: action.totalCount,
        currentPage: action.currentPage,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_TRAININGS_FOR_VALIDATION_SUCCESS':
      return {
        ...state,
        isFetching: false,
        jobTypeTrainingRequirements: action.payload,
        totalCount: action.totalCount,
        error: null
      };
    case 'FETCH_AUTOCOMPLETE_TRAININGS_FAILURE':
    case 'FETCH_AUTOCOMPLETE_TRAININGS_FOR_VALIDATION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
