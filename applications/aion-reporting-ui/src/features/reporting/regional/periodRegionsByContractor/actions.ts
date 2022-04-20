import axios, { AxiosError } from 'axios';
import { IRegion } from 'interfaces/region';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchPeriodRegionsByContractorRequest = (contractorId: string) =>
  ({
    type: 'FETCH_PERIOD_REGIONS_BY_CONTRACTOR_REQUEST',
    contractorId
  } as const);

const fetchPeriodRegionsByContractorSuccess = (contractorId: string, periodId: string, payload: IRegion[]) =>
  ({
    type: 'FETCH_PERIOD_REGIONS_BY_CONTRACTOR_SUCCESS',
    contractorId,
    periodId,
    payload
  } as const);

const fetchPeriodRegionsByContractorFailure = (contractorId: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_PERIOD_REGIONS_BY_CONTRACTOR_FAILURE',
    contractorId,
    error
  } as const;
};

const fetchPeriodRegionsByContractor = (
  contractorId: string,
  periodId: string
): ThunkAction<Promise<IRegion[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchPeriodRegionsByContractorRequest(contractorId));

      const {
        data: { value }
      } = await axios.get<{ value: IRegion[] }>(`/api/v3.01/periods(${periodId})/contractors(${contractorId})/regions`);

      dispatch(fetchPeriodRegionsByContractorSuccess(contractorId, periodId, value));
      resolve(value);
    } catch (error) {
      dispatch(fetchPeriodRegionsByContractorFailure(contractorId, error));
      reject(error);
    }
  });
};

const shouldFetchPeriodRegionsByContractor = (
  { periodRegionsByContractor }: RootState,
  contractorId: string,
  periodId: string
) => {
  const periodRegions = periodRegionsByContractor[contractorId];
  return (
    !periodRegions || (!periodRegions.isFetching && (!periodRegions.regions || periodRegions.periodId !== periodId))
  );
};

export const fetchPeriodRegionsByContractorIfNeeded = (
  contractorId: string,
  periodId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchPeriodRegionsByContractor(getState(), contractorId, periodId)) {
    dispatch(fetchPeriodRegionsByContractor(contractorId, periodId));
  }
};

export type Actions =
  | ReturnType<typeof fetchPeriodRegionsByContractorRequest>
  | ReturnType<typeof fetchPeriodRegionsByContractorSuccess>
  | ReturnType<typeof fetchPeriodRegionsByContractorFailure>;
