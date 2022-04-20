import { Actions as AddAnnouncementActions } from './actions/addAnnouncement';
import { Actions as FetchAnnouncementActions } from './actions/fetchAnnouncement';
import { Actions as DeleteAnnouncementActions } from './actions/deleteAnnouncement';
import { Actions as EditAnnouncementActions } from './actions/editAnnouncement';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IAnnouncement } from 'interfaces/announcement';

export type State = DeepReadonly<{
  isFetching: boolean;
  announcement: IAnnouncement | null;
  error: AxiosError | null;
}>;

type Actions = FetchAnnouncementActions | AddAnnouncementActions | EditAnnouncementActions | DeleteAnnouncementActions;

export const initialState: State = {
  isFetching: false,
  announcement: null,
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_ANNOUNCEMENT_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'ADD_ANNOUNCEMENT_SUCCESS':
    case 'EDIT_ANNOUNCEMENT_SUCCESS':
    case 'FETCH_ANNOUNCEMENT_SUCCESS':
      return {
        isFetching: false,
        announcement: action.payload,
        error: null
      };
    case 'DELETE_ANNOUNCEMENT_SUCCESS':
      return {
        isFetching: false,
        announcement: null,
        error: null
      };
    case 'ADD_ANNOUNCEMENT_FAILURE':
    case 'EDIT_ANNOUNCEMENT_FAILURE':
    case 'DELETE_ANNOUNCEMENT_FAILURE':
    case 'FETCH_ANNOUNCEMENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
