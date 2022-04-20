import axios, { AxiosError, AxiosResponse } from 'axios';
import { IClient } from 'interfaces/client';
import { IContractor } from 'interfaces/contractor';
import { ISafetyProgram } from 'interfaces/safetyProgram';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { overrideStatusOptions } from '../containers/Filters';
import { ClientOverrideStatus } from 'interfaces/requirementOverride';

type Payload = {
  clients: IClient[];
  contractors: IContractor[];
  safetyPrograms: ISafetyProgram[];
  overrideStatuses: {
    value: ClientOverrideStatus;
    label: string;
  }[];
};

const fetchFiltersRequest = () =>
  ({
    type: 'FETCH_FILTERS_REQUEST'
  } as const);

const fetchFiltersSuccess = (payload: Payload) =>
  ({
    type: 'FETCH_FILTERS_SUCCESS',
    payload
  } as const);

const fetchFiltersFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_FILTERS_FAILURE',
    error
  } as const;
};

export const fetchFilters = (
  clientIds: string,
  contractorIds: string,
  safetyProgramIds: string,
  overrideStatuses: string
): ThunkAction<Promise<Payload>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchFiltersRequest());

      const statuses = overrideStatuses.split(',');

      const [clientsResponse, contractorsResponse, safetyProgramsResponse] = (await axios.all([
        clientIds
          ? axios.get('/api/v3.01/safetyProgramClients', {
              params: {
                $filter: `(id in (${clientIds}))`
              }
            })
          : undefined,
        contractorIds
          ? axios.get('/api/v3.01/safetyProgramContractors', {
              params: {
                $filter: `(id in (${contractorIds}))`
              }
            })
          : undefined,
        safetyProgramIds
          ? axios.get('/api/v3.01/safetyPrograms', {
              params: {
                $filter: `(id in (${safetyProgramIds}))`
              }
            })
          : undefined
      ])) as [
        AxiosResponse<{ value: IClient[] }> | undefined,
        AxiosResponse<{ value: IContractor[] }> | undefined,
        AxiosResponse<{ value: ISafetyProgram[] }> | undefined
      ];

      const filters = {
        clients: clientsResponse?.data.value || [],
        contractors: contractorsResponse?.data.value || [],
        safetyPrograms: safetyProgramsResponse?.data.value || [],
        overrideStatuses: overrideStatusOptions.filter(x => statuses.includes(x.value))
      };

      dispatch(fetchFiltersSuccess(filters));
      resolve(filters);
    } catch (error) {
      dispatch(fetchFiltersFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchFiltersRequest>
  | ReturnType<typeof fetchFiltersSuccess>
  | ReturnType<typeof fetchFiltersFailure>;
