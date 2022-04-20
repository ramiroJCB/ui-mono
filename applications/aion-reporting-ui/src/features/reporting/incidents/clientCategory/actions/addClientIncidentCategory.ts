import axios, { AxiosError } from 'axios';
import { fetchClientIncidentCategories } from '../../clientCategories/actions/fetchClientIncidentCategories';
import { IIncidentCategory } from 'interfaces/incidentCategory';
import { reset } from 'redux-form';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addClientIncidentCategoryRequest = () =>
  ({
    type: 'ADD_CLIENT_INCIDENT_CATEGORY_REQUEST'
  } as const);

const addClientIncidentCategorySuccess = (payload: IIncidentCategory) =>
  ({
    type: 'ADD_CLIENT_INCIDENT_CATEGORY_SUCCESS',
    payload
  } as const);

const addClientIncidentCategoryFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_CLIENT_INCIDENT_CATEGORY_FAILURE',
    error
  } as const;
};

export const addClientIncidentCategory = (
  incidentCategory: IIncidentCategory,
  organizationId: string,
  showInactiveCategories: boolean
): ThunkAction<Promise<IIncidentCategory>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      const clientCategory: IIncidentCategory = { ...incidentCategory, clientId: organizationId };

      dispatch(addClientIncidentCategoryRequest());

      const { data } = await axios.post<IIncidentCategory>('/api/v3.01/incidentCategories', clientCategory);

      dispatch(addClientIncidentCategorySuccess(data));
      dispatch(reset('clientCategoryForm'));

      // Fetch categories again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentCategories(organizationId, showInactiveCategories));

      resolve(data);
    } catch (error) {
      dispatch(addClientIncidentCategoryFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addClientIncidentCategoryRequest>
  | ReturnType<typeof addClientIncidentCategorySuccess>
  | ReturnType<typeof addClientIncidentCategoryFailure>;
