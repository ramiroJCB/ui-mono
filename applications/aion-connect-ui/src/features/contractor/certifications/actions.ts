import axios, { AxiosError } from 'axios';
import { ICertification } from 'interfaces/certification';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchCertificationsRequest = () =>
  ({
    type: 'FETCH_CERTIFICATIONS_REQUEST'
  } as const);

const fetchCertificationsSuccess = (payload: ICertification[]) =>
  ({
    type: 'FETCH_CERTIFICATIONS_SUCCESS',
    payload
  } as const);

const fetchCertificationsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CERTIFICATIONS_FAILURE',
    error
  } as const;
};

export const fetchCertifications = (
  organizationId: string
): ThunkAction<Promise<ICertification[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchCertificationsRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .orderBy('name asc')
        .filter(f => f.filterBy('isDeleted', Equals, false))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: ICertification[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/certifications`,
        { params }
      );

      dispatch(fetchCertificationsSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchCertificationsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchCertificationsRequest>
  | ReturnType<typeof fetchCertificationsSuccess>
  | ReturnType<typeof fetchCertificationsFailure>;
