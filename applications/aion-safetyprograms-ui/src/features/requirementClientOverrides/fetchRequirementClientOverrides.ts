import axios, { AxiosError } from 'axios';
import { IClientRequirementOverride } from 'interfaces/requirementOverride';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { parse } from '@pec/aion-ui-core/helpers/querystring';

type ResponseData = { value: IClientRequirementOverride[]; '@odata.count': number };

const { Equals, In } = OdataComparator;

const fetchClientRequirementOverridesRequest = () =>
  ({
    type: 'FETCH_CLIENT_REQUIREMENT_OVERRIDES_REQUEST'
  } as const);

const fetchClientRequirementOverridesSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_CLIENT_REQUIREMENT_OVERRIDES_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchClientRequirementOverridesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_REQUIREMENT_OVERRIDES_FAILURE',
    error
  } as const;
};

const shouldFetchClientRequirementOverrides = (
  clientId: string,
  { clientRequirementOverrides: { clientRequirementOverrides, isFetching } }: RootState
) => !isFetching || (clientRequirementOverrides && clientId !== clientRequirementOverrides[0].clientId);

export const fetchClientRequirementOverridesIfNeeded = (
  clientId: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchClientRequirementOverrides(clientId, getState())) {
    dispatch(fetchClientRequirementOverridesByRequirementClientId(clientId));
  }
};

export const fetchClientRequirementOverridesByRequirementClientId = (
  requirementClientId: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientRequirementOverridesRequest());

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramRequirementClientOverrides', {
        params: {
          $expand: 'requirementClient',
          $filter: `safetyProgramRequirementClientId eq ${requirementClientId}`
        }
      });

      dispatch(fetchClientRequirementOverridesSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchClientRequirementOverridesFailure(error));
      reject(error);
    }
  });

export const fetchClientRequirementOverridesByClientId = (
  search: string,
  clientId: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchClientRequirementOverridesRequest());

      const { contractors, safetyPrograms } = parse(search);
      const { orderby = 'requestUpdatedDateUtc desc' } = parse(search);

      const params = new QueryBuilder()
        .orderBy(orderby)
        .filter(({ filterBy }) => {
          const filter = filterBy('clientId', Equals, clientId).filterBy('status', Equals, 'Requested');
          contractors && filter.and(f => f.filterBy('contractorId', In, contractors.toString().split(',')));
          safetyPrograms && filter.and(f => f.filterBy('safetyProgramId', In, safetyPrograms.toString().split(',')));
          return filter;
        })
        .toQueryParam();

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramRequirementClientOverrides', {
        params: { $expand: 'requirementClient', ...params }
      });
      dispatch(fetchClientRequirementOverridesSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchClientRequirementOverridesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchClientRequirementOverridesRequest>
  | ReturnType<typeof fetchClientRequirementOverridesSuccess>
  | ReturnType<typeof fetchClientRequirementOverridesFailure>;
