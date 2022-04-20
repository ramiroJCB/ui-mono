import axios, { AxiosError } from 'axios';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IContractorRequirement } from 'interfaces/requirement';
import { IOverride } from 'interfaces/override';
import { RootState } from 'combineReducers';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateRequirementRequest = () =>
  ({
    type: 'UPDATE_REQUIREMENT_REQUEST'
  } as const);

const updateRequirementSuccess = (payload: IContractorRequirement) =>
  ({
    type: 'UPDATE_REQUIREMENT_SUCCESS',
    payload
  } as const);

const updateRequirementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_REQUIREMENT_FAILURE',
    error
  } as const;
};

export const updateRequirement = (
  id: string,
  status: SafetyProgramRequirementStatus
): ThunkAction<Promise<IContractorRequirement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateRequirementRequest());

      const { data } = await axios.patch<IContractorRequirement>(`/api/v3.01/safetyProgramRequirements(${id})`, [
        { op: 'replace', path: '/status', value: status }
      ]);

      dispatch(updateRequirementSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateRequirementFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export const updateOverride = (
  overrideId: string,
  isOverridden: boolean,
  safetyProgramRequirementId: string
): ThunkAction<Promise<IContractorRequirement>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(updateRequirementRequest());

      await axios.patch<IOverride>(`/api/v3.01/safetyProgramClientScoreOverrides(${overrideId})`, [
        { op: 'replace', path: '/isOverridden', value: isOverridden }
      ]);
      const { data } = await axios.get<IContractorRequirement>(
        `/api/v3.01/safetyProgramRequirements(${safetyProgramRequirementId})`,
        {
          params: {
            $expand: 'SafetyProgram,Questions,QuestionAnswers,ClientScoreOverrides,Clients,ClientGracePeriods'
          }
        }
      );

      dispatch(updateRequirementSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateRequirementFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof updateRequirementRequest>
  | ReturnType<typeof updateRequirementSuccess>
  | ReturnType<typeof updateRequirementFailure>;
