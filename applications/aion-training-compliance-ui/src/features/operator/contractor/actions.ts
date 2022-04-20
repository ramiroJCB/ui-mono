import axios, { AxiosError } from 'axios';
import { IContractor } from 'interfaces/contractor';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const { Equals } = OdataComparator;

const fetchContractorRequest = () =>
  ({
    type: 'FETCH_CONTRACTOR_REQUEST'
  } as const);

const fetchContractorSuccess = (payload: IContractor) =>
  ({
    type: 'FETCH_CONTRACTOR_SUCCESS',
    payload
  } as const);

const fetchContractorFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTOR_FAILURE',
    error
  } as const;
};

const shouldFetchContractor = (contractorId: string, { contractor: { contractor, isFetching } }: RootState) =>
  (!contractor && !isFetching) || (contractor && contractorId !== contractor.id);

const fetchContractor = (contractorId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchContractorRequest());

    const params = new QueryBuilder().filter(({ filterBy }) => filterBy('id', Equals, contractorId)).toQueryParam();
    const {
      data: { value }
    } = await axios.get<{ value: IContractor }>('/api/trainingCompliance/v3.01/contractors', {
      params
    });

    dispatch(fetchContractorSuccess(value[0]));
  } catch (error) {
    dispatch(fetchContractorFailure(error));
  }
};

export const fetchContractorIfNeeded = (contractorId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchContractor(contractorId, getState())) {
    dispatch(fetchContractor(contractorId));
  }
};

export type Actions =
  | ReturnType<typeof fetchContractorRequest>
  | ReturnType<typeof fetchContractorSuccess>
  | ReturnType<typeof fetchContractorFailure>;
