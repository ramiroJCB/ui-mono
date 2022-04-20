import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const deleteMandateRequest = () =>
  ({
    type: 'DELETE_MANDATE_REQUEST'
  } as const);

const deleteMandateSuccess = () =>
  ({
    type: 'DELETE_MANDATE_SUCCESS'
  } as const);

const deleteMandateFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DELETE_MANDATE_FAILURE',
    error
  } as const;
};

export const deleteMandate = (id: string): ThunkAction<Promise<void>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(deleteMandateRequest());

      await axios.delete(`/api/v3.01/safetyProgramMandates(${id})`);

      dispatch(deleteMandateSuccess());
      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.mandate.mandateDeleted', 'Your mandate has been deleted.'),
          options: {
            variant: 'success'
          }
        })
      );
      resolve();
    } catch (error) {
      dispatch(deleteMandateFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof deleteMandateRequest>
  | ReturnType<typeof deleteMandateSuccess>
  | ReturnType<typeof deleteMandateFailure>;
