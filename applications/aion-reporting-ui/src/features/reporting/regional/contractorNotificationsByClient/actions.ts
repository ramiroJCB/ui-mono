import axios from 'axios';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { PeriodStatus } from 'interfaces/contractorPeriod';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const { Equals, NotEquals } = OdataComparator;
const { Submitted } = PeriodStatus;

const fetchFlexTrackNotificationsCountByClientSuccess = (clientId: string, flexTrackNotificationsCount: number) =>
  ({
    type: 'FETCH_FLEXTRACK_NOTIFICATIONS_COUNT_BY_CLIENT_SUCCESS',
    clientId,
    flexTrackNotificationsCount
  } as const);

const getParams = (organizationId: string, clientId: string) =>
  new QueryBuilder()
    .top(0)
    .filter(f =>
      f
        .filterBy('contractorId', Equals, organizationId)
        .filterBy('clientId', Equals, clientId)
        .filterBy('reportStatus', NotEquals, Submitted)
    )
    .toQueryParam();

export const fetchFlexTrackNotificationsCountByClient = (
  contractorId: string,
  clientId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    const params = getParams(contractorId, clientId);

    const { data } = await axios.get<{ '@odata.count': number }>('/api/v3.01/regionalContractorPeriods', {
      params
    });

    dispatch(fetchFlexTrackNotificationsCountByClientSuccess(clientId, data['@odata.count']));
  } catch (error) {
    sendError(error);
  }
};

export const fetchFlexTrackNotificationsCountByClientIfNeeded = (
  contractorId: string,
  clientId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchFlexTrackNotificationsCountByClient(getState(), clientId)) {
    dispatch(fetchFlexTrackNotificationsCountByClient(contractorId, clientId));
  }
};

const shouldFetchFlexTrackNotificationsCountByClient = (
  { flexTrackNotificationsByClient }: RootState,
  clientId: string
) => !Object.keys(flexTrackNotificationsByClient).includes(clientId);

export type Actions = ReturnType<typeof fetchFlexTrackNotificationsCountByClientSuccess>;
