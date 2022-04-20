import axios, { AxiosError } from 'axios';
import { IIncidentCategory, IncidentCategoryStatus } from 'interfaces/incidentCategory';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchClientIncidentCategoriesRequest = () =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_CATEGORIES_REQUEST'
  } as const);

const fetchClientIncidentCategoriesSuccess = (payload: IIncidentCategory[], clientId: string) =>
  ({
    type: 'FETCH_CLIENT_INCIDENT_CATEGORIES_SUCCESS',
    payload,
    clientId
  } as const);

const fetchClientIncidentCategoriesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_INCIDENT_CATEGORIES_FAILURE',
    error
  } as const;
};

const shouldFetchClientIncidentCategories = (
  { clientIncidentCategories: { isFetching, incidentCategories, clientId: prevClientId } }: RootState,
  clientId: string
) => !isFetching && (!incidentCategories || (prevClientId && prevClientId !== clientId));

export const fetchClientIncidentCategories = (
  clientId: string,
  showInactive?: boolean
): ThunkAction<Promise<IIncidentCategory[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientIncidentCategoriesRequest());

      const {
        data: { value }
      } = await axios.get<{ value: IIncidentCategory[] }>('/api/v3.01/incidentCategories', {
        params: {
          $orderby: 'name',
          $filter: showInactive
            ? `(clientId eq ${clientId})`
            : `(clientId eq ${clientId}) and (status eq '${IncidentCategoryStatus.Active}')`
        }
      });

      dispatch(fetchClientIncidentCategoriesSuccess(value, clientId));
      resolve(value);
    } catch (error) {
      dispatch(fetchClientIncidentCategoriesFailure(error));
      reject(error);
    }
  });
};

export const fetchClientIncidentCategoriesIfNeeded = (
  clientId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchClientIncidentCategories(getState(), clientId)) {
    dispatch(fetchClientIncidentCategories(clientId, getState().options.showInactiveCategories));
  }
};

export type Actions =
  | ReturnType<typeof fetchClientIncidentCategoriesRequest>
  | ReturnType<typeof fetchClientIncidentCategoriesSuccess>
  | ReturnType<typeof fetchClientIncidentCategoriesFailure>;
