import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const deleteOfficeLocationRequest = () =>
  ({
    type: 'DELETE_OFFICE_LOCATION_REQUEST'
  } as const);

export const deleteOfficeLocationSuccess = (payload: string) =>
  ({
    type: 'DELETE_OFFICE_LOCATION_SUCCESS',
    payload
  } as const);

export const deleteOfficeLocationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_OFFICE_LOCATION_FAILURE',
    error
  } as const;
};

export const deleteOfficeLocation = (
  organizationId: string,
  officeLocationId: string
): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteOfficeLocationRequest());

      await axios.delete(`/api/v3.01/organizations(${organizationId})/officeLocations(${officeLocationId})`);

      resolve();
    } catch (error) {
      dispatch(deleteOfficeLocationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteOfficeLocationRequest>
  | ReturnType<typeof deleteOfficeLocationSuccess>
  | ReturnType<typeof deleteOfficeLocationFailure>;
