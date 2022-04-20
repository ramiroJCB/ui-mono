import axios, { AxiosError } from 'axios';
import { IContractor } from 'interfaces/contractor';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchContractorsRequest = () =>
  ({
    type: 'FETCH_CONTRACTORS_REQUEST'
  } as const);

const fetchContractorsSuccess = (payload: IContractor[]) =>
  ({
    type: 'FETCH_CONTRACTORS_SUCCESS',
    payload
  } as const);

const fetchContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTORS_FAILURE',
    error
  } as const;
};

const shouldFetchContractors = ({ clients: { isFetching, clients } }: RootState) => !isFetching && !clients;

export const fetchContractors = (
  organizationId: string,
  featureFilter: OrganizationFeature,
  contractorIds: string[]
): ThunkAction<Promise<IContractor[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchContractorsRequest());
      const $filter =
        contractorIds.length > 0 ? `contractorId in (${contractorIds.map(id => `'${id}'`).join(',')})` : undefined;
      const { data } = await axios.get<IContractor[]>(`/api/v2/organizations/${organizationId}/contractors`, {
        params: {
          featureFilter,
          $filter
        }
      });

      dispatch(fetchContractorsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchContractorsFailure(error));
      reject(error);
    }
  });
};

export const fetchContractorsIfNeeded = (
  organizationId: string,
  featureFilter: OrganizationFeature,
  contractorIds: string[]
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchContractors(getState())) {
    dispatch(fetchContractors(organizationId, featureFilter, contractorIds));
  }
};

export type Actions =
  | ReturnType<typeof fetchContractorsRequest>
  | ReturnType<typeof fetchContractorsSuccess>
  | ReturnType<typeof fetchContractorsFailure>;
