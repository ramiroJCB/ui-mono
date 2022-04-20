import axios, { AxiosError } from 'axios';
import { ILicense } from 'interfaces/license';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchLicensesRequest = () =>
  ({
    type: 'FETCH_LICENSES_REQUEST'
  } as const);

const fetchLicensesSuccess = (payload: ILicense[]) =>
  ({
    type: 'FETCH_LICENSES_SUCCESS',
    payload
  } as const);

const fetchLicensesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_LICENSES_FAILURE',
    error
  } as const;
};

export const fetchLicenses = (
  organizationId: string
): ThunkAction<Promise<ILicense[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchLicensesRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .orderBy('name asc')
        .filter(f => f.filterBy('isDeleted', Equals, false))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: ILicense[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/licenses`,
        { params }
      );

      dispatch(fetchLicensesSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchLicensesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchLicensesRequest>
  | ReturnType<typeof fetchLicensesSuccess>
  | ReturnType<typeof fetchLicensesFailure>;
