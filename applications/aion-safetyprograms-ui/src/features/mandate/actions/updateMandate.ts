import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IExpandedMandate, IMandate, IMandateForm } from 'interfaces/mandate';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const updateMandateRequest = () =>
  ({
    type: 'UPDATE_MANDATE_REQUEST'
  } as const);

const updateMandateSuccess = (payload: IExpandedMandate) =>
  ({
    type: 'UPDATE_MANDATE_SUCCESS',
    payload
  } as const);

const updateMandateFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_MANDATE_FAILURE',
    error
  } as const;
};

export const updateMandate = ({
  id,
  assigneesType,
  businessUnitIds,
  regionalServiceIdsByRegion,
  gracePeriodExpirationDateUtc
}: IMandateForm): ThunkAction<Promise<IMandate>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateMandateRequest());

      await axios.patch<IMandate>(`/api/v3.01/safetyProgramMandates(${id})`, [
        {
          op: 'replace',
          path: '/BusinessUnitIds',
          value: assigneesType === 'businessUnits' ? businessUnitIds : []
        },
        {
          op: 'replace',
          path: '/RegionalServiceIds',
          value: assigneesType === 'services' ? Object.values(regionalServiceIdsByRegion).flat() : []
        },
        {
          op: 'replace',
          path: '/GracePeriodExpirationDateUtc',
          value: gracePeriodExpirationDateUtc
        }
      ]);

      const { data } = await axios.get<IExpandedMandate>(`/api/v3.01/safetyProgramMandates(${id})`, {
        params: {
          $expand: 'BusinessUnits,Client,RegionalServices,SafetyProgram'
        }
      });

      dispatch(updateMandateSuccess(data));
      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.common.updatesSaved', 'Your updates have been saved.'),
          options: {
            variant: 'success'
          }
        })
      );
      resolve();
    } catch (error) {
      dispatch(updateMandateFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateMandateRequest>
  | ReturnType<typeof updateMandateSuccess>
  | ReturnType<typeof updateMandateFailure>;
