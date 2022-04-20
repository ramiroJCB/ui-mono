import axios, { AxiosError } from 'axios';
import { IContractor } from 'interfaces/contractor';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialContractorsRequest = () =>
  ({
    type: 'FETCH_INITIAL_CONTRACTORS_REQUEST'
  } as const);

const fetchContractorsRequest = () =>
  ({
    type: 'FETCH_CONTRACTORS_REQUEST'
  } as const);

const fetchContractorsSuccess = (payload: IContractor[], totalCount: number) =>
  ({
    type: 'FETCH_CONTRACTORS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTORS_FAILURE',
    error
  } as const;
};

export const fetchContractors = (
  organizationId: string,
  top: number = 0,
  skip: number = 0,
  name?: string | string[],
  contractorIds?: string
): ThunkAction<Promise<IContractor[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch((top === 0 ? fetchInitialContractorsRequest : fetchContractorsRequest)());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) => {
          const filter = filterBy('name', Contains, name)
            .filterBy('clientId', Equals, organizationId)
            .filterBy('isDeleted', Equals, false);

          if (contractorIds && !Array.isArray(contractorIds)) {
            filter.and(f => {
              contractorIds.split(',').map(id => f.or(e => e.filterBy('id', Equals, id)));
              return f;
            });
          }

          return filter;
        })
        .orderBy('name')
        .toQueryParam();

      const response = await axios.get<{ value: IContractor[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/contractors',
        { params }
      );

      const contractors = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchContractorsSuccess(contractors, totalCount));
      resolve(contractors);
    } catch (error) {
      dispatch(fetchContractorsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialContractorsRequest>
  | ReturnType<typeof fetchContractorsRequest>
  | ReturnType<typeof fetchContractorsSuccess>
  | ReturnType<typeof fetchContractorsFailure>;
