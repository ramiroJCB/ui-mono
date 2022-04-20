import { Actions as FetchCommentsActions } from './actions/fetchComments';
import { Actions as UpdateCommentsActions } from './actions/updateComments';
import { Actions as AddCommentActions } from 'features/comment/actions/addComment';
import { Actions as DeleteCommentActions } from 'features/comment/actions/deleteComment';
import { Actions as UpdateCommentActions } from 'features/comment/actions/updateComment';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IComment } from 'interfaces/comment';

export type State = DeepReadonly<{
  isFetching: boolean;
  isSubmitting: boolean;
  isUpdating: boolean;
  comments: IComment[] | null;
  questionAnswerId: string | null;
  error: AxiosError | null;
}>;

type Actions =
  | AddCommentActions
  | DeleteCommentActions
  | FetchCommentsActions
  | UpdateCommentActions
  | UpdateCommentsActions;

export const initialState: State = {
  isFetching: false,
  isSubmitting: false,
  isUpdating: false,
  comments: null,
  questionAnswerId: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_COMMENT_REQUEST':
      return {
        ...state,
        isSubmitting: true
      };
    case 'FETCH_COMMENTS_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'DELETE_COMMENT_REQUEST':
    case 'UPDATE_COMMENT_REQUEST':
      return {
        ...state,
        isUpdating: true
      };
    case 'UPDATE_COMMENTS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'ADD_COMMENT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        comments: [action.payload].concat(state.comments || []),
        questionAnswerId: action.payload.questionAnswerId,
        error: null
      };
    case 'DELETE_COMMENT_SUCCESS':
      return {
        ...state,
        isUpdating: false,
        comments: state.comments && state.comments.filter(({ id }) => id !== action.id)
      };
    case 'FETCH_COMMENTS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        comments: action.payload,
        questionAnswerId: action.questionAnswerId,
        error: null
      };
    case 'UPDATE_COMMENT_SUCCESS':
      return {
        ...state,
        isUpdating: false,
        comments:
          state.comments &&
          state.comments.map(comment => (comment.id === action.payload.id ? action.payload : comment)),
        questionAnswerId: action.payload.questionAnswerId
      };
    case 'ADD_COMMENT_FAILURE':
      return {
        ...state,
        isSubmitting: false
      };
    case 'DELETE_COMMENT_FAILURE':
    case 'UPDATE_COMMENT_FAILURE':
      return {
        ...state,
        isUpdating: false
      };
    case 'UPDATE_COMMENTS_FAILURE':
      return {
        ...state,
        isUpdating: false
      };
    case 'FETCH_COMMENTS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
