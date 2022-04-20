import axios, { AxiosError } from 'axios';
import { IIncident } from 'interfaces/incident';
import { makeSkipParam } from '@pec/aion-ui-odata/helpers/formatters';
import { ParsedUrlQuery } from 'querystring';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import { toArray } from '@pec/aion-ui-core/helpers/querystring';

const fetchIncidentsByClientRequest = () =>
  ({
    type: 'FETCH_INCIDENTS_REQUEST'
  } as const);

const fetchIncidentsByClientSuccess = (payload: IIncident[], totalCount: number) =>
  ({
    type: 'FETCH_INCIDENTS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchIncidentsByClientFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_INCIDENTS_FAILURE',
    error
  } as const;
};

const shouldFetchIncidentsByClient = ({ incidents: { isFetching } }: RootState) => !isFetching;

export const fetchIncidentsByClient = (
  organizationId: string,
  { start, end, page, ...query }: ParsedUrlQuery
): ThunkAction<Promise<IIncident[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchIncidentsByClientRequest());
      const inQueries: string[] = [];
      const filters: string[] = [];
      const buildFilter = (queries: string[], queryFilters: string[]) => {
        if (queries.length > 0) {
          return `${queries.map(filter => `${filter}`).join(' and ')} and ${queryFilters
            .map(filter => `(${filter})`)
            .join(' and ')}`;
        } else {
          return `${queryFilters.map(filter => `(${filter})`).join(' and ')}`;
        }
      };
      ['contractorId', 'incidentCategoryId', 'incidentTypeId'].forEach(prop => {
        const ids = query[`${prop}s`];
        if (ids && ids.length > 0) {
          const filter = `${prop} in (${toArray(ids)
            .map(id => `'${id}'`)
            .join(',')})`;
          inQueries.push(filter);
        }
      });
      filters.push(`clientId eq ${organizationId}`);
      if (start !== undefined) {
        filters.push(`occurredOnDateUtc ge ${start}`);
      }

      if (end !== undefined) {
        filters.push(`occurredOnDateUtc le ${end}`);
      }
      const $filter = buildFilter(inQueries, filters);
      const $top = 10;
      const $skip = makeSkipParam(page || '1', $top);
      const response = await axios.get<{ value: IIncident[] }>('/api/v3.01/incidents', {
        params: {
          includeMetadata: true,
          $filter,
          $orderBy: 'occurredOnDateUtc desc',
          $skip,
          $top
        }
      });

      const incidents = response.data.value || response.data; // API || json-server
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchIncidentsByClientSuccess(incidents, totalCount));
      resolve(incidents);
    } catch (error) {
      dispatch(fetchIncidentsByClientFailure(error));
      reject(error);
    }
  });
};

export const fetchIncidentsByClientIfNeeded = (
  organizationId: string,
  search: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchIncidentsByClient(getState())) {
    dispatch(fetchIncidentsByClient(organizationId, search));
  }
};

export type Actions =
  | ReturnType<typeof fetchIncidentsByClientRequest>
  | ReturnType<typeof fetchIncidentsByClientSuccess>
  | ReturnType<typeof fetchIncidentsByClientFailure>;
