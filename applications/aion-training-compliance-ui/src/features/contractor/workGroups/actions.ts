import axios, { AxiosError } from 'axios';
import { IWorkGroupContractor } from 'interfaces/workGroupContractor';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialWorkGroupContractorsRequest = () =>
  ({
    type: 'FETCH_INITIAL_WORK_GROUP_CONTRACTORS_REQUEST'
  } as const);

const fetchWorkGroupContractorsRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_CONTRACTORS_REQUEST'
  } as const);

const fetchWorkGroupContractorsSuccess = (payload: IWorkGroupContractor[], totalCount: number) =>
  ({
    type: 'FETCH_WORK_GROUP_CONTRACTORS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchWorkGroupContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_CONTRACTORS_FAILURE',
    error
  } as const;
};

export const fetchWorkGroupContractors = (
  organizationId: string,
  clientId: string,
  top: number = 0,
  skip: number = 0,
  name?: string | string[]
): ThunkAction<Promise<IWorkGroupContractor[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch((top === 0 ? fetchInitialWorkGroupContractorsRequest : fetchWorkGroupContractorsRequest)());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('isDeleted', Equals, false)
            .filterBy('contractorOrganizationId', Equals, organizationId)
            .filterBy('organizationId', Equals, clientId)
            .filterBy('workGroupName', Contains, name)
        )
        .orderBy('workGroupName')
        .expand('workGroup')
        .toQueryParam();

      const response = await axios.get<{ value: IWorkGroupContractor[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupContractors',
        { params }
      );

      const workGroupContractors = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchWorkGroupContractorsSuccess(workGroupContractors, totalCount));
      resolve(workGroupContractors);
    } catch (error) {
      dispatch(fetchWorkGroupContractorsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialWorkGroupContractorsRequest>
  | ReturnType<typeof fetchWorkGroupContractorsRequest>
  | ReturnType<typeof fetchWorkGroupContractorsSuccess>
  | ReturnType<typeof fetchWorkGroupContractorsFailure>;
