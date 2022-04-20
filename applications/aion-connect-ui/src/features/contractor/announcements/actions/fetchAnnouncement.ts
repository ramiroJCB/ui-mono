import axios, { AxiosError } from 'axios';
import { IAnnouncement } from 'interfaces/announcement';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchAnnouncementRequest = () =>
  ({
    type: 'FETCH_ANNOUNCEMENT_REQUEST'
  } as const);

export const fetchAnnouncementSuccess = (payload: IAnnouncement | null) =>
  ({
    type: 'FETCH_ANNOUNCEMENT_SUCCESS',
    payload
  } as const);

export const fetchAnnouncementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_ANNOUNCEMENT_FAILURE',
    error
  } as const;
};

export const fetchAnnouncement = (
  organizationId: string
): ThunkAction<Promise<IAnnouncement | null>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAnnouncementRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .filter(f => f.filterBy('isDeleted', Equals, false).filterBy('organizationId', Equals, organizationId))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: IAnnouncement[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/announcements`,
        { params }
      );

      dispatch(fetchAnnouncementSuccess(value.length ? value[0] : null));
      resolve(value.length ? value[0] : null);
    } catch (error) {
      dispatch(fetchAnnouncementFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchAnnouncementRequest>
  | ReturnType<typeof fetchAnnouncementSuccess>
  | ReturnType<typeof fetchAnnouncementFailure>;
