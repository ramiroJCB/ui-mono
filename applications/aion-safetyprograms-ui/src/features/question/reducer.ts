import { Actions as AddQuestionActions } from './actions/addQuestion';
import { Actions as DeleteQuestionActions } from './actions/deleteQuestion';
import { Actions as FetchQuestionActions } from './actions/fetchQuestion';
import { Actions as UpdateQuestionActions } from './actions/updateQuestion';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IExpandedQuestion } from 'interfaces/question';
import { moveQuestion } from 'helpers/questionOrder';

export type State = DeepReadonly<{
  isFetching: boolean;
  question: IExpandedQuestion | null;
  error: AxiosError | null;
}>;

type Actions = AddQuestionActions | DeleteQuestionActions | FetchQuestionActions | UpdateQuestionActions;

export const initialState: State = {
  isFetching: false,
  question: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_QUESTION_REQUEST':
    case 'DELETE_QUESTION_REQUEST':
    case 'FETCH_QUESTION_REQUEST':
    case 'UPDATE_QUESTION_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_QUESTION_SUCCESS':
      return {
        isFetching: false,
        question: {
          ...action.payload,
          questions: []
        },
        error: null
      };
    case 'DELETE_QUESTION_SUCCESS':
      return {
        isFetching: false,
        question: null,
        error: null
      };
    case 'FETCH_QUESTION_SUCCESS':
      return {
        isFetching: false,
        question: action.payload,
        error: null
      };
    case 'UPDATE_QUESTION_SUCCESS':
      return {
        isFetching: false,
        question: {
          ...action.payload,
          questions: state.question?.questions || []
        },
        error: null
      };
    case 'ADD_QUESTION_FAILURE':
    case 'DELETE_QUESTION_FAILURE':
    case 'FETCH_QUESTION_FAILURE':
    case 'UPDATE_QUESTION_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'UPDATE_QUESTION_SUBQUESTIONS_ORDER':
      if (state.question) {
        const { sourceIndex, destinationIndex } = action;

        return {
          isFetching: true,
          question: {
            ...state.question,
            questions: moveQuestion(state.question.questions, sourceIndex, destinationIndex)
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
