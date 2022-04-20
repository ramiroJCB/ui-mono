import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAnnouncement } from 'interfaces/announcement';
import { IAnnouncementForm } from 'interfaces/announcementForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addAnnouncementRequest = () =>
  ({
    type: 'ADD_ANNOUNCEMENT_REQUEST'
  } as const);

export const addAnnouncementSuccess = (payload: IAnnouncement) =>
  ({
    type: 'ADD_ANNOUNCEMENT_SUCCESS',
    payload
  } as const);

export const addAnnouncementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_ANNOUNCEMENT_FAILURE',
    error
  } as const;
};

export const addAnnouncement = (
  organizationId: string,
  values: IAnnouncementForm
): ThunkAction<Promise<IAnnouncement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addAnnouncementRequest());

      const { data } = await axios.post<IAnnouncement>(
        `/api/v3.01/organizations(${organizationId})/announcements`,
        values
      );

      dispatch(addAnnouncementSuccess(data));

      dispatch(
        enqueueSnackbar({
          message: 'Your announcement has been added.',
          options: {
            variant: 'success'
          }
        })
      );

      resolve(data);
    } catch (error) {
      dispatch(addAnnouncementFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addAnnouncementRequest>
  | ReturnType<typeof addAnnouncementSuccess>
  | ReturnType<typeof addAnnouncementFailure>;
