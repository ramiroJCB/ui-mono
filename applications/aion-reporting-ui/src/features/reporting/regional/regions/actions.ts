import axios, { AxiosError } from 'axios';
import { IRegion } from 'interfaces/region';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRegionsRequest = () =>
  ({
    type: 'FETCH_REGIONS_REQUEST'
  } as const);

const fetchRegionsSuccess = (payload: IRegion[], periodId: string) =>
  ({
    type: 'FETCH_REGIONS_SUCCESS',
    payload,
    periodId
  } as const);

const fetchRegionsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONS_FAILURE',
    error
  } as const;
};

const shouldFetchRegions = (
  { regions: { regions, periodId: prevPeriodId, isFetching } }: RootState,
  periodId: string
) => !isFetching && (!regions || periodId !== prevPeriodId);

const fetchRegions = (
  organizationId: string,
  periodId: string,
  clientId?: string
): ThunkAction<Promise<IRegion[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionsRequest());

      const params = {
        $orderby: 'name'
      };

      const {
        data: { value }
      } = await axios.get<{ value: IRegion[] }>(
        `/api/v3.01/organizations(${organizationId})/periods(${periodId})/regions`,
        {
          params: clientId ? { ...params, $filter: `clientId eq ${clientId}` } : params
        }
      );

      dispatch(fetchRegionsSuccess(value, periodId));
      resolve(value);
    } catch (error) {
      dispatch(fetchRegionsFailure(error));
      reject(error);
    }
  });
};

export const fetchRegionsIfNeeded = (
  organizationId: string,
  periodId: string,
  clientId?: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchRegions(getState(), periodId)) {
    dispatch(fetchRegions(organizationId, periodId, clientId));
  }
};

export type Actions =
  | ReturnType<typeof fetchRegionsRequest>
  | ReturnType<typeof fetchRegionsSuccess>
  | ReturnType<typeof fetchRegionsFailure>;
