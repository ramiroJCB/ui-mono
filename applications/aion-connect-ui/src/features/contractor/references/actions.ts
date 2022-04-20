import axios, { AxiosError } from 'axios';
import { IReference } from 'interfaces/reference';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchReferencesRequest = () =>
  ({
    type: 'FETCH_REFERENCES_REQUEST'
  } as const);

const fetchReferencesSuccess = (payload: IReference[]) =>
  ({
    type: 'FETCH_REFERENCES_SUCCESS',
    payload
  } as const);

const fetchReferencesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REFERENCES_FAILURE',
    error
  } as const;
};

export const fetchReferences = (
  organizationId: string
): ThunkAction<Promise<IReference[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchReferencesRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .orderBy('name asc')
        .filter(f => f.filterBy('isDeleted', Equals, false))
        .toQueryParam();

      const {
        data: { value }
      } = await axios.get<{ value: IReference[]; '@odata.count': number }>(
        `/api/v3.01/organizations(${organizationId})/references`,
        { params }
      );

      dispatch(fetchReferencesSuccess(value));
      resolve(value);
    } catch (error) {
      dispatch(fetchReferencesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchReferencesRequest>
  | ReturnType<typeof fetchReferencesSuccess>
  | ReturnType<typeof fetchReferencesFailure>;
