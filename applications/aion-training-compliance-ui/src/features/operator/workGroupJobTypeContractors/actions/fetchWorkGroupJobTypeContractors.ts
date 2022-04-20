import axios, { AxiosError } from 'axios';
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialWorkGroupJobTypeContractorsRequest = () =>
  ({
    type: 'FETCH_INITIAL_WORK_GROUP_JOB_TYPE_CONTRACTORS_REQUEST'
  } as const);

const fetchWorkGroupJobTypeContractorsRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTORS_REQUEST'
  } as const);

const fetchWorkGroupJobTypeContractorsSuccess = (payload: IOperatorWorkGroupJobTypeContractor[], totalCount: number) =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTORS_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchWorkGroupJobTypeContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_JOB_TYPE_CONTRACTORS_FAILURE',
    error
  } as const;
};

export const fetchWorkGroupJobTypeContractors = (
  id: string,
  top: number = 0,
  skip: number = 0,
  contractorName?: string | string[]
): ThunkAction<Promise<IOperatorWorkGroupJobTypeContractor[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(
        (top === 0 ? fetchInitialWorkGroupJobTypeContractorsRequest : fetchWorkGroupJobTypeContractorsRequest)()
      );

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('workGroupJobTypeId', Equals, id)
            .filterBy('isDeleted', Equals, false)
            .filterBy('contractorName', Contains, contractorName)
        )
        .orderBy('contractorName')
        .toQueryParam();

      const response = await axios.get<{ value: IOperatorWorkGroupJobTypeContractor[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypeContractors',
        { params }
      );
      const workGroupJobTypes = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchWorkGroupJobTypeContractorsSuccess(workGroupJobTypes, totalCount));
      resolve(workGroupJobTypes);
    } catch (error) {
      dispatch(fetchWorkGroupJobTypeContractorsFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialWorkGroupJobTypeContractorsRequest>
  | ReturnType<typeof fetchWorkGroupJobTypeContractorsRequest>
  | ReturnType<typeof fetchWorkGroupJobTypeContractorsSuccess>
  | ReturnType<typeof fetchWorkGroupJobTypeContractorsFailure>;
