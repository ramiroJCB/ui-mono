import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IEditOfficeLocationForm } from 'interfaces/officeLocationForm';
import { IOfficeLocation } from 'interfaces/officeLocation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const editOfficeLocationRequest = () =>
  ({
    type: 'EDIT_OFFICE_LOCATION_REQUEST'
  } as const);

export const editOfficeLocationSuccess = (payload: IOfficeLocation) =>
  ({
    type: 'EDIT_OFFICE_LOCATION_SUCCESS',
    payload
  } as const);

export const editOfficeLocationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_OFFICE_LOCATION_FAILURE',
    error
  } as const;
};

export const editOfficeLocation = (
  organizationId: string,
  values: IEditOfficeLocationForm
): ThunkAction<Promise<IOfficeLocation>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editOfficeLocationRequest());

      if (values.state && values.state.value) {
        const { data } = await axios.put<IOfficeLocation>(
          `/api/v3.01/organizations(${organizationId})/officeLocations(${values.id})`,
          { ...values, state: values.state.value }
        );

        dispatch(editOfficeLocationSuccess(data));
        resolve(data);
      } else {
        throw new Error('State value not found.');
      }
    } catch (error) {
      dispatch(editOfficeLocationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editOfficeLocationRequest>
  | ReturnType<typeof editOfficeLocationSuccess>
  | ReturnType<typeof editOfficeLocationFailure>;
