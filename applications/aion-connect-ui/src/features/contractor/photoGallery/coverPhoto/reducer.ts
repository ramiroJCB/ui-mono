import { Actions as FetchCoverPhotoActions } from './actions/fetchCoverPhoto';
import { Actions as SetCoverImageActions } from './actions/setCoverPhoto';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IImage } from 'interfaces/image';

export type State = DeepReadonly<{
  isFetching: boolean;
  coverPhoto?: IImage;
  error: AxiosError | null;
}>;

type Actions = SetCoverImageActions | FetchCoverPhotoActions;

export const initialState: State = {
  isFetching: false,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'SET_COVER_PHOTO_SUCCESS':
      return {
        ...state,
        coverPhoto: action.payload
      };
    case 'FETCH_COVER_PHOTO_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_COVER_PHOTO_SUCCESS':
      return {
        ...state,
        isFetching: false,
        coverPhoto: action.payload
      };
    case 'FETCH_COVER_PHOTO_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
