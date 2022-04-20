import axios, { AxiosError } from 'axios';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchContractorRequest = () =>
  ({
    type: 'FETCH_CONTRACTOR_REQUEST'
  } as const);

const fetchContractorSuccess = (payload: IOrganization) =>
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

const shouldFetchContractor = ({ contractor: { isFetching } }: RootState) => !isFetching;

const fetchContractor = (contractorId: string): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchContractorRequest());

    const response = await axios.get<IOrganization>(`/api/v2/organizations/${contractorId}`);

    dispatch(fetchContractorSuccess(response.data));
  } catch (error) {
    dispatch(fetchContractorFailure(error));
  }
};

export const fetchContractorIfNeeded = (contractorId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchContractor(getState())) {
    dispatch(fetchContractor(contractorId));
  }
};

export type Actions =
  | ReturnType<typeof fetchContractorRequest>
  | ReturnType<typeof fetchContractorSuccess>
  | ReturnType<typeof fetchContractorFailure>;
