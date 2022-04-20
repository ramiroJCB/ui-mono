import axios, { AxiosError } from 'axios';
import { IActivityResource } from 'interfaces/activityResource';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchActivityResourcesRequest = () =>
  ({
    type: 'FETCH_ACTIVITY_RESOURCES_REQUEST'
  } as const);

export const fetchActivityResourcesSuccess = (payload: IActivityResource[]) =>
  ({
    type: 'FETCH_ACTIVITY_RESOURCES_SUCCESS',
    payload
  } as const);

export const fetchActivityResourcesFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'FETCH_ACTIVITY_RESOURCES_FAILURE',
    error
  } as const;
};

const shouldFetchActivityResources = ({ activityResources: { activityResources, isFetching } }: RootState) =>
  !activityResources && !isFetching;

const fetchActivityResources = (): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchActivityResourcesRequest());

    const response = await axios.get<IActivityResource[]>('/api/v3/activityResources');

    dispatch(fetchActivityResourcesSuccess(response.data));
  } catch (error) {
    dispatch(fetchActivityResourcesFailure(error));
  }
};

export const fetchActivityResourcesIfNeeded = (): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchActivityResources(getState())) {
    dispatch(fetchActivityResources());
  }
};

export type Actions =
  | ReturnType<typeof fetchActivityResourcesRequest>
  | ReturnType<typeof fetchActivityResourcesSuccess>
  | ReturnType<typeof fetchActivityResourcesFailure>;
