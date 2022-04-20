import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAccreditation } from 'interfaces/accreditation';
import { IAccreditationForm } from 'interfaces/accreditationForm';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addAccreditationRequest = () =>
  ({
    type: 'ADD_ACCREDITATION_REQUEST'
  } as const);

export const addAccreditationSuccess = (payload: IAccreditation) =>
  ({
    type: 'ADD_ACCREDITATION_SUCCESS',
    payload
  } as const);

export const addAccreditationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_ACCREDITATION_FAILURE',
    error
  } as const;
};

export const addAccreditation = (
  organizationId: string,
  values: IAccreditationForm
): ThunkAction<Promise<IAccreditation>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addAccreditationRequest());

      const { data } = await axios.post<IAccreditation>(
        `/api/v3.01/organizations(${organizationId})/accreditations`,
        values
      );

      dispatch(addAccreditationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addAccreditationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addAccreditationRequest>
  | ReturnType<typeof addAccreditationSuccess>
  | ReturnType<typeof addAccreditationFailure>;
