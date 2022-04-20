import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteAnnouncementRequest = () =>
  ({
    type: 'DELETE_ANNOUNCEMENT_REQUEST'
  } as const);

export const deleteAnnouncementSuccess = () =>
  ({
    type: 'DELETE_ANNOUNCEMENT_SUCCESS'
  } as const);

export const deleteAnnouncementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_ANNOUNCEMENT_FAILURE',
    error
  } as const;
};

export const deleteAnnouncement = (
  organizationId: string,
  announcementId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteAnnouncementRequest());

      await axios.delete(`/api/v3.01/organizations(${organizationId})/announcements(${announcementId})`);

      dispatch(deleteAnnouncementSuccess());
      resolve();
    } catch (error) {
      dispatch(deleteAnnouncementFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteAnnouncementRequest>
  | ReturnType<typeof deleteAnnouncementSuccess>
  | ReturnType<typeof deleteAnnouncementFailure>;
