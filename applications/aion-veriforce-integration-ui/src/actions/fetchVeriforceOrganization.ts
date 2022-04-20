import axios, { AxiosError } from 'axios';
import { IVeriforceOrganization } from 'interfaces/veriforceOrganization';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchVeriforceOrganizationRequest = (username: string, password: string) =>
  ({
    type: 'FETCH_VERIFORCE_ORGANIZATION_REQUEST',
    username,
    password
  } as const);

const fetchVeriforceOrganizationSuccess = (payload: IVeriforceOrganization) =>
  ({
    type: 'FETCH_VERIFORCE_ORGANIZATION_SUCCESS',
    payload
  } as const);

const fetchVeriforceOrganizationFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_VERIFORCE_ORGANIZATION_FAILURE',
    error
  } as const;
};

export const resetVeriforceOrganization = () =>
  ({
    type: 'RESET_VERIFORCE_ORGANIZATION'
  } as const);

const shouldFetchVeriforceOrganization = (
  {
    veriforceOrganization: { veriforceOrganization, username: prevUsername, password: prevPassword, isFetching }
  }: RootState,
  username: string,
  password: string
) => !isFetching && (!veriforceOrganization || username !== prevUsername || password !== prevPassword);

const fetchVeriforceOrganization = (
  username: string,
  password: string
): ThunkAction<Promise<IVeriforceOrganization>, RootState, null, Actions> => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchVeriforceOrganizationRequest(username, password));

      const { data } = await axios.get('/api/v3.01/veriforceOrganization', {
        headers: {
          'X-Veriforce-UserName': username,
          'X-Veriforce-Password': password
        }
      });

      dispatch(fetchVeriforceOrganizationSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchVeriforceOrganizationFailure(error));
      reject(error);
    }
  });

export const fetchVeriforceOrganizationIfNeeded = (
  username: string,
  password: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchVeriforceOrganization(getState(), username, password)) {
    dispatch(fetchVeriforceOrganization(username, password));
  }
};

export type Actions =
  | ReturnType<typeof fetchVeriforceOrganizationRequest>
  | ReturnType<typeof fetchVeriforceOrganizationSuccess>
  | ReturnType<typeof fetchVeriforceOrganizationFailure>
  | ReturnType<typeof resetVeriforceOrganization>;
