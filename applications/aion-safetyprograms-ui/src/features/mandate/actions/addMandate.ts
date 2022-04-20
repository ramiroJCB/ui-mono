import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IExpandedMandate, IMandate, IMandateForm } from 'interfaces/mandate';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const addMandateRequest = () =>
  ({
    type: 'ADD_MANDATE_REQUEST'
  } as const);

const addMandateSuccess = (payload: IExpandedMandate) =>
  ({
    type: 'ADD_MANDATE_SUCCESS',
    payload
  } as const);

const addMandateFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_MANDATE_FAILURE',
    error
  } as const;
};

export const addMandate = ({
  clientId,
  safetyProgramId,
  businessUnitIds,
  regionalServiceIdsByRegion,
  assigneesType,
  gracePeriodExpirationDateUtc
}: IMandateForm): ThunkAction<Promise<IMandate>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addMandateRequest());

      const {
        data: { id }
      } = await axios.post<IMandate>('/api/v3.01/safetyProgramMandates', {
        clientId,
        safetyProgramId,
        businessUnitIds: assigneesType === 'businessUnits' ? businessUnitIds : [],
        regionalServiceIds: assigneesType === 'services' ? Object.values(regionalServiceIdsByRegion).flat() : [],
        gracePeriodExpirationDateUtc
      });
      const { data } = await axios.get<IExpandedMandate>(`/api/v3.01/safetyProgramMandates(${id})`, {
        params: {
          $expand: 'BusinessUnits,Client,RegionalServices,SafetyProgram'
        }
      });

      dispatch(addMandateSuccess(data));
      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.mandate.programAssigned', 'Your program has been assigned.'),
          options: {
            variant: 'success'
          }
        })
      );
      resolve(data);
    } catch (error) {
      dispatch(addMandateFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addMandateRequest>
  | ReturnType<typeof addMandateSuccess>
  | ReturnType<typeof addMandateFailure>;
