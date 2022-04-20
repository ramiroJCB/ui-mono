import axios, { AxiosError } from 'axios';
import { IIncidentCategory } from 'interfaces/incidentCategory';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentCategoryRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_CATEGORY_REQUEST'
  } as const);

const fetchClientIncidentCategorySuccess = (payload: IIncidentCategory) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_CATEGORY_SUCCESS',
    payload
  } as const);

const fetchClientIncidentCategoryFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_CATEGORY_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentCategory = (
  { clientIncidentCategory: { isFetching, incidentCategory } }: RootState,
  incidentCategoryId: string
) => !isFetching && (!incidentCategory || incidentCategory.id !== incidentCategoryId);

const fetchClientIncidentCategory = (
  incidentCategoryId: string
): ThunkAction<Promise<IIncidentCategory>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentCategoryRequest());

      const { data } = await axios.get<IIncidentCategory>(`/api/v3.01/incidentCategories(${incidentCategoryId})`);

      dispatch(fetchClientIncidentCategorySuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchClientIncidentCategoryFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentCategoryIfNeeded = (
  incidentCategoryId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentCategory(getState(), incidentCategoryId)) {
    dispatch(fetchClientIncidentCategory(incidentCategoryId));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentCategoryRequest>
  | ReturnType<typeof fetchClientIncidentCategorySuccess>
  | ReturnType<typeof fetchClientIncidentCategoryFailure>;
