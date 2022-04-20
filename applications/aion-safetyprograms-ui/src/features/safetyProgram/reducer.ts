import { Actions as AddSafetyProgramActions } from './actions/addSafetyProgram';
import { Actions as DeleteSafetyProgramActions } from './actions/deleteSafetyProgram';
import { Actions as FetchSafetyProgramActions } from './actions/fetchSafetyProgram';
import { Actions as UpdateSafetyProgramActions } from './actions/updateSafetyProgram';
import { Actions as UpdateGracePeriodPromptedActions } from './actions/updateGracePeriodPrompted';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IExpandedSafetyProgram } from 'interfaces/safetyProgram';
import { moveQuestion } from 'helpers/questionOrder';

export type State = DeepReadonly<{
  isFetching: boolean;
  safetyProgram: IExpandedSafetyProgram | null;
  gracePeriodPrompted: boolean;
  error: AxiosError | null;
}>;

type Actions =
  | AddSafetyProgramActions
  | DeleteSafetyProgramActions
  | FetchSafetyProgramActions
  | UpdateSafetyProgramActions
  | UpdateGracePeriodPromptedActions;

export const initialState: State = {
  isFetching: false,
  safetyProgram: null,
  gracePeriodPrompted: false,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_SAFETY_PROGRAM_REQUEST':
    case 'DELETE_SAFETY_PROGRAM_REQUEST':
    case 'FETCH_SAFETY_PROGRAM_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'UPDATE_SAFETY_PROGRAM_REQUEST':
      return {
        ...state,
        error: null
      };
    case 'UPDATE_GRACE_PERIOD_PROMPTED':
      return {
        ...state,
        gracePeriodPrompted: action.payload
      };
    case 'ADD_SAFETY_PROGRAM_SUCCESS':
      return {
        ...state,
        isFetching: false,
        safetyProgram: {
          ...action.payload,
          questions: []
        },
        error: null
      };
    case 'DELETE_SAFETY_PROGRAM_SUCCESS':
      return {
        ...state,
        isFetching: false,
        safetyProgram: null,
        error: null
      };
    case 'FETCH_SAFETY_PROGRAM_SUCCESS':
      return {
        ...state,
        isFetching: false,
        safetyProgram: action.payload,
        error: null
      };
    case 'UPDATE_SAFETY_PROGRAM_SUCCESS':
      return {
        ...state,
        isFetching: false,
        safetyProgram: {
          ...action.payload,
          questions: state.safetyProgram?.questions || []
        },
        error: null
      };
    case 'ADD_SAFETY_PROGRAM_FAILURE':
    case 'DELETE_SAFETY_PROGRAM_FAILURE':
    case 'FETCH_SAFETY_PROGRAM_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'UPDATE_SAFETY_PROGRAM_FAILURE':
      return {
        ...state,
        isFetching: false
      };
    case 'UPDATE_SAFETY_PROGRAM_QUESTIONS_ORDER':
      if (state.safetyProgram) {
        const { sourceIndex, destinationIndex } = action;

        return {
          ...state,
          isFetching: true,
          safetyProgram: {
            ...state.safetyProgram,
            questions: moveQuestion(state.safetyProgram.questions, sourceIndex, destinationIndex)
          },
          error: null
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
