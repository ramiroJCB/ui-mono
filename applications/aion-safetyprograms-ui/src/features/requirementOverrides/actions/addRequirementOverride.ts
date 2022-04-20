import axios, { AxiosError } from 'axios';
import { AnyAction } from 'redux';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchRequirementOverrides } from './fetchRequirementOverrides';
import { IRequirementOverride } from 'interfaces/requirementOverride';
import { IRequirementOverrideRequestForm } from '../components/RequirementOverrides';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const addRequirementOverrideRequest = () =>
  ({
    type: 'ADD_REQUIREMENT_OVERRIDE_REQUEST'
  } as const);

const addRequirementOverrideSuccess = (payload: IRequirementOverride) =>
  ({
    type: 'ADD_REQUIREMENT_OVERRIDE_SUCCESS',
    payload
  } as const);

const addRequirementOverrideFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_REQUIREMENT_OVERRIDE_FAILURE',
    error
  } as const;
};

export const addRequirementOverride = (
  { safetyProgramRequirementId, comment }: IRequirementOverrideRequestForm,
  organizationId: string
): ThunkAction<Promise<IRequirementOverride>, RootState, null, AnyAction> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(addRequirementOverrideRequest());

      const { data } = await axios.post<IRequirementOverride>('/api/v3.01/safetyProgramRequirementOverrideRequests', {
        safetyProgramRequirementId,
        comment
      });

      dispatch(fetchRequirementOverrides(safetyProgramRequirementId, organizationId));
      dispatch(
        enqueueSnackbar({
          message: i18next.t(
            'safetyPrograms.requirementOverrides.exceptionRequestSaved',
            'Exception request has been submitted.'
          ),
          options: {
            variant: 'success'
          }
        })
      );
      resolve(data);
    } catch (error) {
      dispatch(addRequirementOverrideFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addRequirementOverrideRequest>
  | ReturnType<typeof addRequirementOverrideSuccess>
  | ReturnType<typeof addRequirementOverrideFailure>;
