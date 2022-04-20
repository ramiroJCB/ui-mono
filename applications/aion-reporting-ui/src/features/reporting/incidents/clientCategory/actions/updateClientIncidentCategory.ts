import axios, { AxiosError } from 'axios';
import { fetchClientIncidentCategories } from '../../clientCategories/actions/fetchClientIncidentCategories';
import { IIncidentCategory } from 'interfaces/incidentCategory';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateClientIncidentCategoryRequest = () =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_CATEGORY_REQUEST'
  } as const);

const updateClientIncidentCategorySuccess = (payload: IIncidentCategory) =>
  ({
    type: 'UPDATE_CLIENT_INCIDENT_CATEGORY_SUCCESS',
    payload
  } as const);

const updateClientIncidentCategoryFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_CLIENT_INCIDENT_CATEGORY_FAILURE',
    error
  } as const;
};

export const updateClientIncidentCategory = (
  clientCategory: IIncidentCategory,
  organizationId: string,
  showInactiveCategories: boolean
): ThunkAction<Promise<IIncidentCategory>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateClientIncidentCategoryRequest());

      const { data } = await axios.put<IIncidentCategory>(
        `/api/v3.01/incidentCategories(${clientCategory.id})`,
        clientCategory
      );

      dispatch(updateClientIncidentCategorySuccess(data));

      // Fetch categories again to update state since the server handles filtering and sorting
      await dispatch(fetchClientIncidentCategories(organizationId, showInactiveCategories));

      resolve(data);
    } catch (error) {
      dispatch(updateClientIncidentCategoryFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateClientIncidentCategoryRequest>
  | ReturnType<typeof updateClientIncidentCategorySuccess>
  | ReturnType<typeof updateClientIncidentCategoryFailure>;
