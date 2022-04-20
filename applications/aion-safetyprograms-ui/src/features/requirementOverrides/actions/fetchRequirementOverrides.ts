import axios, { AxiosError } from 'axios';
import { IRequirementOverride } from 'interfaces/requirementOverride';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';

type ResponseData = { value: IRequirementOverride[]; '@odata.count': number };

const fetchRequirementOverridesRequest = () =>
  ({
    type: 'FETCH_REQUIREMENT_OVERRIDES_REQUEST'
  } as const);

const fetchRequirementOverridesSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_REQUIREMENT_OVERRIDES_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchRequirementOverridesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REQUIREMENT_OVERRIDES_FAILURE',
    error
  } as const;
};

export const fetchRequirementOverrides = (
  requirementId: string,
  organizationId: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRequirementOverridesRequest());

      const { data } = await axios.get<ResponseData>(`/api/v3.01/safetyProgramRequirementOverrideRequests`, {
        params: {
          $expand: 'clientOverrides',
          $filter: `isActive eq true and safetyProgramRequirementId eq ${requirementId}`
        },
        headers: {
          'X-Aion-OrganizationId': organizationId
        }
      });

      dispatch(fetchRequirementOverridesSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchRequirementOverridesFailure(error));
      reject(error);
    }
  });

export const fetchAllRequirementOverrides = (
  organizationId: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    const { Equals } = OdataComparator;

    const requirementParams = new QueryBuilder()
      .filter(({ filterBy }) => filterBy('isActive', Equals, true))
      .toQueryParam();

    try {
      dispatch(fetchRequirementOverridesRequest());

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramRequirementOverrideRequests', {
        params: {
          $orderBy: 'createdDateUtc desc',
          ...requirementParams
        },
        headers: {
          'X-Aion-OrganizationId': organizationId
        }
      });

      dispatch(fetchRequirementOverridesSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchRequirementOverridesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchRequirementOverridesRequest>
  | ReturnType<typeof fetchRequirementOverridesSuccess>
  | ReturnType<typeof fetchRequirementOverridesFailure>;
