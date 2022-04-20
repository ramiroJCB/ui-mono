import { Actions } from './actions';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IUploadedImage } from 'interfaces/uploadedImage';

export type State = DeepReadonly<{
  isFetching: boolean;
  metaData: IUploadedImage[];
  error: AxiosError | null;
  organizationId: string | null;
}>;

export const initialState: State = {
  isFetching: false,
  metaData: [],
  error: null,
  organizationId: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_PHOTO_GALLERY_METADATA_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_PHOTO_GALLERY_METADATA_SUCCESS':
      return {
        ...state,
        isFetching: false,
        metaData: action.payload,
        organizationId: action.organizationId
      };
    case 'FETCH_PHOTO_GALLERY_METADATA_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
