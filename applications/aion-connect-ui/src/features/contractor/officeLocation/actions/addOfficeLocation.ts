import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IOfficeLocation } from 'interfaces/officeLocation';
import { IOfficeLocationForm } from 'interfaces/officeLocationForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addOfficeLocationRequest = () =>
  ({
    type: 'ADD_OFFICE_LOCATION_REQUEST'
  } as const);

export const addOfficeLocationSuccess = (payload: IOfficeLocation) =>
  ({
    type: 'ADD_OFFICE_LOCATION_SUCCESS',
    payload
  } as const);

export const addOfficeLocationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_OFFICE_LOCATION_FAILURE',
    error
  } as const;
};

export const addOfficeLocation = (
  organizationId: string,
  values: IOfficeLocationForm
): ThunkAction<Promise<IOfficeLocation>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addOfficeLocationRequest());

      if (values.state && values.state.value) {
        const { data } = await axios.post<IOfficeLocation>(
          `/api/v3.01/organizations(${organizationId})/officeLocations`,
          { ...values, state: values.state.value }
        );

        dispatch(addOfficeLocationSuccess(data));
        resolve(data);
      } else {
        throw new Error('State value not found.');
      }
    } catch (error) {
      dispatch(addOfficeLocationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addOfficeLocationRequest>
  | ReturnType<typeof addOfficeLocationSuccess>
  | ReturnType<typeof addOfficeLocationFailure>;
