import axios, { AxiosError } from 'axios';
import { IContractorRequirement } from 'interfaces/requirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRequirementRequest = () =>
  ({
    type: 'FETCH_REQUIREMENT_REQUEST'
  } as const);

const fetchRequirementSuccess = (payload: IContractorRequirement) =>
  ({
    type: 'FETCH_REQUIREMENT_SUCCESS',
    payload
  } as const);

const fetchRequirementFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REQUIREMENT_FAILURE',
    error
  } as const;
};

const shouldFetchRequirement = ({ requirement: { requirement, isFetching } }: RootState, id: string) =>
  !isFetching && requirement?.id !== id;

export const fetchRequirement = (
  id: string
): ThunkAction<Promise<IContractorRequirement>, RootState, null, Actions> => async (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRequirementRequest());
      const { userInfo } = getState().userInfo;

      const { data } = await axios.get<IContractorRequirement>(
        `/api/v3.01/safetyProgramRequirements(${id.replace(/'/g, '')})`,
        {
          params: {
            $expand: 'SafetyProgram,Questions,QuestionAnswers,ClientScoreOverrides,Clients,ClientGracePeriods'
          },
          headers: {
            'X-Aion-OrganizationId': userInfo?.primaryOrganizationId
          }
        }
      );

      dispatch(fetchRequirementSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchRequirementFailure(error));
      reject(error);
    }
  });

export const fetchRequirementIfNeeded = (id: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchRequirement(getState(), id)) {
    dispatch(fetchRequirement(id));
  }
};

export type Actions =
  | ReturnType<typeof fetchRequirementRequest>
  | ReturnType<typeof fetchRequirementSuccess>
  | ReturnType<typeof fetchRequirementFailure>;
