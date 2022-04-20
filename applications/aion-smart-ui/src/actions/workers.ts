import axios, { AxiosError } from 'axios';
import { IWorker, WorkerStatus } from 'interfaces/worker';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchWorkersRequest = () =>
  ({
    type: 'FETCH_WORKERS_REQUEST'
  } as const);

const fetchWorkersSuccess = (payload: IWorker[]) =>
  ({
    type: 'FETCH_WORKERS_SUCCESS',
    payload
  } as const);

const fetchWorkersFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORKERS_FAILURE',
    error
  } as const;
};

const shouldFetchWorkers = ({ workers: { isFetching } }: RootState) => !isFetching;

const fetchWorkers = (
  organizationId: string,
  siteId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchWorkersRequest());

    const response = await axios.get<{ value: IWorker[] }>(
      `/api/v2/organizations(${organizationId})/sites(${siteId})/workers`,
      {
        params: {
          $filter: `status eq '${WorkerStatus.CheckedIn}'`
        }
      }
    );

    dispatch(fetchWorkersSuccess(response.data.value));
  } catch (error) {
    dispatch(fetchWorkersFailure(error));
  }
};

export const fetchWorkersIfNeeded = (
  organizationId: string,
  siteId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchWorkers(getState())) {
    dispatch(fetchWorkers(organizationId, siteId));
  }
};

export type Actions =
  | ReturnType<typeof fetchWorkersRequest>
  | ReturnType<typeof fetchWorkersSuccess>
  | ReturnType<typeof fetchWorkersFailure>;
