import axios, { AxiosError } from 'axios';
import { AnyAction } from 'redux';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IClientRequirementOverride } from 'interfaces/requirementOverride';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { IRequirementOverrideForm } from 'features/requirementOverrides/components/RequirementOverrides';
import { fetchClientRequirementOverridesIfNeeded } from 'features/requirementClientOverrides/fetchRequirementClientOverrides';
import i18next from 'i18next';

const addRequirementClientOverrideRequest = () =>
  ({
    type: 'ADD_CLIENT_REQUIREMENT_OVERRIDE_REQUEST'
  } as const);

const addRequirementClientOverrideSuccess = (payload: IClientRequirementOverride) =>
  ({
    type: 'ADD_CLIENT_REQUIREMENT_OVERRIDE_SUCCESS',
    payload
  } as const);

const addRequirementClientOverrideFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_CLIENT_REQUIREMENT_OVERRIDE_FAILURE',
    error
  } as const;
};

export const addRequirementClientOverride = ({
  safetyProgramRequirementClientId,
  comment
}: IRequirementOverrideForm): ThunkAction<
  Promise<IClientRequirementOverride>,
  RootState,
  null,
  AnyAction
> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addRequirementClientOverrideRequest());

      const { data } = await axios.post<IClientRequirementOverride>(
        '/api/v3.01/safetyProgramRequirementClientOverrides',
        {
          safetyProgramRequirementClientId,
          comment
        }
      );

      dispatch(
        enqueueSnackbar({
          message: i18next.t('safetyPrograms.requirementClientOverride.exceptionGranted', 'Exception Granted.'),
          options: {
            variant: 'success'
          }
        })
      );

      dispatch(fetchClientRequirementOverridesIfNeeded(data.safetyProgramRequirementClientId));
      dispatch(addRequirementClientOverrideSuccess(data));

      resolve(data);
    } catch (error) {
      dispatch(addRequirementClientOverrideFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addRequirementClientOverrideRequest>
  | ReturnType<typeof addRequirementClientOverrideSuccess>
  | ReturnType<typeof addRequirementClientOverrideFailure>;
