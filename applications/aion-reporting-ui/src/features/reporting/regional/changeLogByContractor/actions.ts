import axios, { AxiosError } from 'axios';
import { IRegionalChangeLogEntry } from 'interfaces/regionalChangeLogEntry';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRegionalChangeLogByContractorRequest = (contractorId: string) =>
  ({
    type: 'FETCH_REGIONAL_CHANGELOG_BY_CONTRACTOR_REQUEST',
    contractorId
  } as const);

const fetchRegionalChangeLogByContractorSuccess = (
  contractorId: string,
  periodId: string,
  payload: IRegionalChangeLogEntry[]
) =>
  ({
    type: 'FETCH_REGIONAL_CHANGELOG_BY_CONTRACTOR_SUCCESS',
    contractorId,
    periodId,
    payload
  } as const);

const fetchRegionalChangeLogByContractorFailure = (contractorId: string, error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONAL_CHANGELOG_BY_CONTRACTOR_FAILURE',
    contractorId,
    error
  } as const;
};

const fetchRegionalChangeLogByContractor = (
  periodId: string,
  contractorId: string
): ThunkAction<Promise<IRegionalChangeLogEntry[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionalChangeLogByContractorRequest(contractorId));

      const response = await axios.get<{ value: IRegionalChangeLogEntry[]; '@odata.count': number }>(
        '/api/v3.01/regionalChangeLog',
        {
          params: {
            $orderby: 'createdDateUtc desc',
            $filter: `(periodId eq ${periodId}) and (createdByOrganizationId eq ${contractorId})`
          }
        }
      );

      const changelog = response.data.value;

      dispatch(fetchRegionalChangeLogByContractorSuccess(contractorId, periodId, changelog));
      resolve(changelog);
    } catch (error) {
      dispatch(fetchRegionalChangeLogByContractorFailure(contractorId, error));
      reject(error);
    }
  });
};

const shouldFetchRegionalChangeLogByContractor = (
  { regionalChangeLogByContractor }: RootState,
  periodId: string,
  contractorId: string
) => {
  const changeLog = regionalChangeLogByContractor[contractorId];
  return !changeLog || (!changeLog.isFetching && (!changeLog.regionalChangeLog || changeLog.periodId !== periodId));
};

export const fetchRegionalChangeLogByContractorIfNeeded = (
  periodId: string,
  contractorId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchRegionalChangeLogByContractor(getState(), periodId, contractorId)) {
    dispatch(fetchRegionalChangeLogByContractor(periodId, contractorId));
  }
};

export type Actions =
  | ReturnType<typeof fetchRegionalChangeLogByContractorRequest>
  | ReturnType<typeof fetchRegionalChangeLogByContractorSuccess>
  | ReturnType<typeof fetchRegionalChangeLogByContractorFailure>;
