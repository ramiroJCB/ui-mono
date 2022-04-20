import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAnnouncement } from 'interfaces/announcement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const editAnnouncementRequest = () =>
  ({
    type: 'EDIT_ANNOUNCEMENT_REQUEST'
  } as const);

export const editAnnouncementSuccess = (payload: IAnnouncement) =>
  ({
    type: 'EDIT_ANNOUNCEMENT_SUCCESS',
    payload
  } as const);

export const editAnnouncementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_ANNOUNCEMENT_FAILURE',
    error
  } as const;
};

export const editAnnouncement = (
  organizationId: string,
  values: IAnnouncement
): ThunkAction<Promise<IAnnouncement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editAnnouncementRequest());

      const { data } = await axios.put<IAnnouncement>(
        `/api/v3.01/organizations(${organizationId})/announcements(${values.id})`,
        values
      );

      dispatch(editAnnouncementSuccess(data));

      dispatch(
        enqueueSnackbar({
          message: 'Your announcement has been updated.',
          options: {
            variant: 'success'
          }
        })
      );

      resolve(data);
    } catch (error) {
      dispatch(editAnnouncementFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editAnnouncementRequest>
  | ReturnType<typeof editAnnouncementSuccess>
  | ReturnType<typeof editAnnouncementFailure>;
