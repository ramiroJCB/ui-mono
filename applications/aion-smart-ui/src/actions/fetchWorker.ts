import axios, { AxiosError } from 'axios';
import { IEmployeeWithTrainee } from '@pec/aion-ui-core/interfaces/employee';
import { IWorker } from 'interfaces/worker';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { v4 as uuid } from 'uuid';

export const fetchWorkerRequest = () =>
  ({
    type: 'FETCH_WORKER_REQUEST'
  } as const);

export const fetchWorkerSuccess = (payload: IWorker) =>
  ({
    type: 'FETCH_WORKER_SUCCESS',
    payload
  } as const);

export const fetchWorkerFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORKER_FAILURE',
    error
  } as const;
};

const shouldFetchWorker = ({ worker: { isFetching, worker } }: RootState, siteId: string, employeeId: string) =>
  !isFetching && (!worker || worker.employeeId !== employeeId || worker.siteId !== siteId);

export const fetchWorker = (
  organizationId: string,
  siteId: string,
  employeeId: string
): ThunkAction<Promise<IWorker>, RootState, null, Actions> => async dispatch => {
  return new Promise<IWorker>(async (resolve, reject) => {
    try {
      dispatch(fetchWorkerRequest());

      const response = await axios.get<{ value: IWorker[] }>(
        `/api/v2/organizations(${organizationId})/sites(${siteId})/workers`,
        {
          params: {
            $filter: `employeeId eq ${employeeId}`
          }
        }
      );
      const worker = response.data.value[0];
      if (!worker) {
        throw new Error(`Employee with ID ${employeeId} was not found on Site with ID ${siteId}.`);
      }

      dispatch(fetchWorkerSuccess(worker));
      resolve(worker);
    } catch (workerError) {
      try {
        const {
          data: {
            organizationId: employeeOrganizationId,
            trainee: { firstName, lastName, phoneNumber, photoUrl },
            organization: { name: organizationName }
          }
        } = await axios.get<IEmployeeWithTrainee>(`/spapi/employees/${employeeId}`);

        const worker = {
          id: uuid(),
          siteId,
          employeeId,
          firstName,
          lastName,
          mobilePhoneNumber: phoneNumber,
          photoUrl,
          organizationId: employeeOrganizationId,
          organizationName,
          pecIdentifier: null,
          lastUpdatedDate: null,
          status: null
          // TODO: Uncomment this when we have back-end support
          // livesOnSite: false
        };

        dispatch(fetchWorkerSuccess(worker));
        resolve(worker);
      } catch (error) {
        dispatch(fetchWorkerFailure(error));
        reject(error);
      }
    }
  });
};

export const fetchWorkerIfNeeded = (
  organizationId: string,
  siteId: string,
  employeeId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchWorker(getState(), siteId, employeeId)) {
    dispatch(fetchWorker(organizationId, siteId, employeeId));
  }
};

export type Actions =
  | ReturnType<typeof fetchWorkerRequest>
  | ReturnType<typeof fetchWorkerSuccess>
  | ReturnType<typeof fetchWorkerFailure>;
