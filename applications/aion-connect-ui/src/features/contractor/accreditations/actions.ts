import axios, { AxiosError } from 'axios';
import { IAccreditation } from 'interfaces/accreditation';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchAccreditationsRequest = () =>
  ({
    type: 'FETCH_ACCREDITATIONS_REQUEST'
  } as const);

const fetchAccreditationsSuccess = (payload: IAccreditation[]) =>
  ({
    type: 'FETCH_ACCREDITATIONS_SUCCESS',
    payload
  } as const);

const fetchAccreditationsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_ACCREDITATIONS_FAILURE',
    error
  } as const;
};

export const fetchAccreditations = (
  organizationId: string
): ThunkAction<Promise<IAccreditation[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchAccreditationsRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .orderBy('name asc')
        .filter(f => f.filterBy('isDeleted', Equals, false))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: IAccreditation[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/accreditations`,
        { params }
      );

      dispatch(fetchAccreditationsSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchAccreditationsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchAccreditationsRequest>
  | ReturnType<typeof fetchAccreditationsSuccess>
  | ReturnType<typeof fetchAccreditationsFailure>;
