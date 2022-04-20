import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { ClientOverrideStatus, IClientRequirementOverride } from 'interfaces/requirementOverride';
import { fetchClientRequirementOverridesIfNeeded } from 'features/requirementClientOverrides/fetchRequirementClientOverrides';
import i18next from 'i18next';

const updateClientRequirementOverrideRequest = () =>
  ({
    type: 'UPDATE_CLIENT_REQUIREMENT_OVERRIDE_REQUEST'
  } as const);

const updateClientRequirementOverrideSuccess = (payload: IClientRequirementOverride) =>
  ({
    type: 'UPDATE_CLIENT_REQUIREMENT_OVERRIDE_SUCCESS',
    payload
  } as const);

const updateClientRequirementOverrideFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_CLIENT_REQUIREMENT_OVERRIDE_FAILURE',
    error
  } as const;
};

const getSnackbarVariant = ({ status }: IClientRequirementOverride) =>
  status === ClientOverrideStatus.Approved || status === ClientOverrideStatus.Granted
    ? 'success'
    : status === ClientOverrideStatus.Denied
    ? 'info'
    : undefined;

export const updateClientRequirementOverride = (
  id: string,
  status: ClientOverrideStatus,
  comment?: string
): ThunkAction<Promise<IClientRequirementOverride>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateClientRequirementOverrideRequest());

      const { data } = await axios.patch<IClientRequirementOverride>(
        `/api/v3.01/safetyProgramRequirementClientOverrides(${id})`,
        [
          { op: 'replace', path: '/status', value: status },
          { op: 'replace', path: '/comment', value: comment }
        ]
      );

      dispatch(updateClientRequirementOverrideSuccess(data));
      dispatch(fetchClientRequirementOverridesIfNeeded(data.safetyProgramRequirementClientId));

      resolve(data);
      dispatch(
        enqueueSnackbar({
          message: data.status
            ? i18next.t(`safetyPrograms.clientOverrideStatuses.${data.status.toLowerCase()}Status`)
            : i18next.t('safetyPrograms.common.none', 'None'),
          options: {
            variant: getSnackbarVariant(data)
          }
        })
      );
    } catch (error) {
      dispatch(updateClientRequirementOverrideFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateClientRequirementOverrideRequest>
  | ReturnType<typeof updateClientRequirementOverrideSuccess>
  | ReturnType<typeof updateClientRequirementOverrideFailure>;
