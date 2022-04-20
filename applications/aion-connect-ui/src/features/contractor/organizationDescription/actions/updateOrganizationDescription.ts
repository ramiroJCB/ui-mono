import axios, { AxiosError } from 'axios';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { IEditOrganizationDescriptionForm } from 'interfaces/editOrganizationDescription';

export const updateOrganizationRequest = () =>
  ({
    type: 'UPDATE_ORGANIZATION_REQUEST'
  } as const);

export const updateOrganizationSuccess = (payload: IOrganization) =>
  ({
    type: 'UPDATE_ORGANIZATION_SUCCESS',
    payload
  } as const);

export const updateOrganizationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_ORGANIZATION_FAILURE',
    error
  } as const;
};

export const updateOrganization = (
  organizationId: string,
  value: IEditOrganizationDescriptionForm
): ThunkAction<Promise<IOrganization>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateOrganizationRequest());

      const { data } = await axios.patch<IOrganization>(`/api/v2/organizations/${organizationId}`, [
        { op: 'replace', path: '/description', value: value.description }
      ]);

      dispatch(updateOrganizationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateOrganizationFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateOrganizationRequest>
  | ReturnType<typeof updateOrganizationSuccess>
  | ReturnType<typeof updateOrganizationFailure>;
