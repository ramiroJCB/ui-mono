import { Actions as FetchLogoActions } from './actions/fetchLogo';
import { Actions as AddLogoActions } from './actions/addLogo';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IUploadedLogo } from 'interfaces/uploadedLogo';

export type State = DeepReadonly<{
  isFetching: boolean;
  metaData?: IUploadedLogo | null;
  logo?: Blob | null;
  error: AxiosError | null;
}>;

type Actions = FetchLogoActions | AddLogoActions;

export const initialState: State = {
  isFetching: false,
  metaData: null,
  logo: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_LOGO_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_LOGO_SUCCESS':
    case 'ADD_LOGO_SUCCESS':
      return {
        ...state,
        isFetching: false,
        metaData: action.metaData,
        logo: action.payload,
        error: null
      };
    case 'FETCH_LOGO_FAILURE':
    case 'ADD_LOGO_FAILURE':
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
