import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAccreditation } from 'interfaces/accreditation';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const editAccreditationRequest = () =>
  ({
    type: 'EDIT_ACCREDITATION_REQUEST'
  } as const);

export const editAccreditationSuccess = (payload: IAccreditation) =>
  ({
    type: 'EDIT_ACCREDITATION_SUCCESS',
    payload
  } as const);

export const editAccreditationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'EDIT_ACCREDITATION_FAILURE',
    error
  } as const;
};

export const editAccreditation = (
  organizationId: string,
  values: IAccreditation
): ThunkAction<Promise<IAccreditation>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(editAccreditationRequest());

      const { data } = await axios.put<IAccreditation>(
        `/api/v3.01/organizations(${organizationId})/accreditations(${values.id})`,
        values
      );

      dispatch(editAccreditationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(editAccreditationFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof editAccreditationRequest>
  | ReturnType<typeof editAccreditationSuccess>
  | ReturnType<typeof editAccreditationFailure>;
