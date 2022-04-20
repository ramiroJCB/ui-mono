import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { IWorker } from 'interfaces/worker';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const updateWorkerRequest = () =>
  ({
    type: 'UPDATE_WORKER_REQUEST'
  } as const);

export const updateWorkerSuccess = (payload: IWorker, workersOffset: number) =>
  ({
    type: 'UPDATE_WORKER_SUCCESS',
    payload,
    workersOffset
  } as const);

export const updateWorkerFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_WORKER_FAILURE',
    error
  } as const;
};

export const updateWorker = (
  organizationId: string,
  { pecIdentifier: _pecIdentifier, lastUpdatedDate: _lastUpdatedDate, ...worker }: IWorker,
  history: History,
  shouldRedirect = true,
  workersOffset = 0
): ThunkAction<Promise<IWorker>, RootState, null, Actions> => dispatch => {
  return new Promise<IWorker>(async (resolve, reject) => {
    try {
      dispatch(updateWorkerRequest());

      const { id, siteId } = worker;
      const response = await axios.put<IWorker>(
        `/api/v2/organizations(${organizationId})/sites(${siteId})/workers(${id})`,
        worker
      );
      const updatedWorker = response.data;

      dispatch(updateWorkerSuccess(updatedWorker, workersOffset));

      if (shouldRedirect) {
        history.push(`/${organizationId}/sites/${siteId}`);
      }

      resolve(updatedWorker);
    } catch (error) {
      dispatch(updateWorkerFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateWorkerRequest>
  | ReturnType<typeof updateWorkerSuccess>
  | ReturnType<typeof updateWorkerFailure>;
