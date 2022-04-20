import axios, { AxiosError } from 'axios';
import { IWorkerDetail } from 'interfaces/workerDetail';
import { makeFilterParam, makeSkipParam } from '@pec/aion-ui-odata/helpers/formatters';
import { ParsedUrlQuery } from 'querystring';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const fetchReportRequest = () =>
  ({
    type: 'FETCH_REPORT_REQUEST'
  } as const);

export const fetchReportSuccess = (payload: IWorkerDetail[], totalCount: number) =>
  ({
    type: 'FETCH_REPORT_SUCCESS',
    payload,
    totalCount
  } as const);

export const fetchReportFailure = (error: AxiosError | Error) => {
  sendError(error);
  return {
    type: 'FETCH_REPORT_FAILURE',
    error
  } as const;
};

export const filterFormatters = {
  siteIds: (id: string) => `siteId eq ${id}`,
  tags: (tag: string) => `contains(tolower(siteTags),'${tag.toLowerCase()}')`
};

export const fetchReport = (
  organizationId: string,
  { start, end, page, ...query }: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchReportRequest());

    const $top = 100;
    const $filter = makeFilterParam(filterFormatters, `dateTimeIn ge ${start} and dateTimeOut le ${end}`, query);
    const $skip = page && makeSkipParam(page, $top);

    const response = await axios.get<{ '@odata.count': number; value: IWorkerDetail[] }>(
      `/api/v2/organizations(${organizationId})/workerDetails`,
      {
        params: {
          $filter, // API
          $skip, // API
          $top, // API
          _limit: $top, // json-server
          _page: page // json-server
        }
      }
    );

    const payload = response.data.value || response.data; // API || json-server
    const totalCount =
      response.data['@odata.count'] !== undefined
        ? response.data['@odata.count']
        : parseInt(response.headers['x-total-count'], 10); // API || json-server

    dispatch(fetchReportSuccess(payload, totalCount));
  } catch (error) {
    dispatch(fetchReportFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof fetchReportRequest>
  | ReturnType<typeof fetchReportSuccess>
  | ReturnType<typeof fetchReportFailure>;
