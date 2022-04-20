import axios, { AxiosError } from 'axios';
import { History } from 'history';
import { IIncident } from 'interfaces/incident';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addIncidentRequest = () =>
  ({
    type: 'ADD_INCIDENT_REQUEST'
  } as const);

const addIncidentSuccess = (payload: IIncident) =>
  ({
    type: 'ADD_INCIDENT_SUCCESS',
    payload
  } as const);

const addIncidentFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_INCIDENT_FAILURE',
    error
  } as const;
};

export const addIncident = (
  organizationId: string,
  incidentForm: IIncident,
  history: History
): ThunkAction<Promise<IIncident>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(addIncidentRequest());

      const { data } = await axios.post<IIncident>('/api/v3.01/incidents', incidentForm);

      dispatch(addIncidentSuccess(data));
      history.push(`/${organizationId}/reporting/incidents`);

      resolve(data);
    } catch (error) {
      dispatch(addIncidentFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addIncidentRequest>
  | ReturnType<typeof addIncidentSuccess>
  | ReturnType<typeof addIncidentFailure>;
