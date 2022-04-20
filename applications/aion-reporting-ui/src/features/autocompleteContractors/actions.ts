import axios, { AxiosError } from 'axios';
import { IContractor } from 'interfaces/contractor';
import { IContractorPeriod } from 'interfaces/contractorPeriod';
import { IMetricContractor } from 'interfaces/metricContractor';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAutocompleteContractorsRequest = () =>
  ({
    type: 'FETCH_AUTOCOMPLETE_CONTRACTORS_REQUEST'
  } as const);

const fetchAutocompleteContractorsSuccess = (payload: IMetricContractor[] | IContractor[], total: number) =>
  ({
    type: 'FETCH_AUTOCOMPLETE_CONTRACTORS_SUCCESS',
    payload,
    total
  } as const);

const fetchAutocompleteContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_AUTOCOMPLETE_CONTRACTORS_FAILURE',
    error
  } as const;
};

export const fetchAutocompleteRegionalContractors = (
  organizationId: string,
  periodId: string,
  inputValue?: string
): ThunkAction<Promise<IMetricContractor[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteContractorsRequest());

      const $top = 10;
      const params = inputValue && {
        $filter: `contains(tolower(name),'${inputValue.toLowerCase()}')`
      };

      const response = await axios.get<{ value: IMetricContractor[]; '@odata.count': number }>(
        `/api/v3.00/organizations(${organizationId})/periods(${periodId})/contractors`,
        {
          params: {
            ...params,
            $orderby: 'name',
            $top, // API
            _limit: $top // json-server
          }
        }
      );

      const payload = response.data.value || response.data; // API || json-server
      const totalCount = response.data['@odata.count'] || parseInt(response.headers['x-total-count'], 10); // API || json-server

      dispatch(fetchAutocompleteContractorsSuccess(payload, totalCount));
      resolve(payload);
    } catch (error) {
      dispatch(fetchAutocompleteContractorsFailure(error));
      reject(error);
    }
  });
};

export const fetchAutocompleteOperationalContractors = (
  organizationId: string,
  periodId: string,
  inputValue?: string
): ThunkAction<Promise<IContractor[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteContractorsRequest());

      const $top = 10;
      let $filter = `(clientId eq ${organizationId}) and (periodId eq ${periodId})`;

      if (inputValue) {
        $filter = `${$filter} and contains(tolower(contractorName),'${inputValue.toLowerCase()}')`;
      }

      const response = await axios.get<{ value: IContractorPeriod[]; '@odata.count': number }>(
        '/api/v3.01/operationalContractorPeriods',
        {
          params: {
            $filter,
            $orderby: 'contractorName',
            $top, // API
            _limit: $top // json-server
          }
        }
      );

      const payload = response.data.value || response.data; // API || json-server
      const totalCount = response.data['@odata.count'] || parseInt(response.headers['x-total-count'], 10); // API || json-server
      const contractors = payload.map(
        ({ contractorId, contractorName, reportStatus, reportStatusUpdatedDateUtc }) =>
          ({
            id: contractorId,
            name: contractorName,
            metricStatus: reportStatus,
            metricStatusUpdatedDateUtc: reportStatusUpdatedDateUtc
          } as IContractor)
      );

      dispatch(fetchAutocompleteContractorsSuccess(contractors, totalCount));
      resolve(contractors);
    } catch (error) {
      dispatch(fetchAutocompleteContractorsFailure(error));
      reject(error);
    }
  });
};

export const fetchAutocompleteContractors = (
  organizationId: string,
  featureFilter: OrganizationFeature,
  inputValue?: string
): ThunkAction<Promise<IContractor[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAutocompleteContractorsRequest());

      const pageSize = 10;
      const response = await axios.get<IContractor[]>(`/api/v2/organizations/${organizationId}/contractors`, {
        params: {
          featureFilter,
          search: inputValue,
          pageSize, // API
          _limit: pageSize // json-server
        }
      });

      const payload = response.data;
      const totalCount = response.headers['x-pagination']
        ? JSON.parse(response.headers['x-pagination']).TotalCount
        : response.headers['x-total-count']; // API || json-server

      dispatch(fetchAutocompleteContractorsSuccess(payload, totalCount));
      resolve(payload);
    } catch (error) {
      dispatch(fetchAutocompleteContractorsFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchAutocompleteContractorsRequest>
  | ReturnType<typeof fetchAutocompleteContractorsSuccess>
  | ReturnType<typeof fetchAutocompleteContractorsFailure>;
