import axios, { AxiosError } from 'axios';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialWorkGroupJobTypeEmployeesRequest = () =>
  ({
    type: 'FETCH_INITIAL_WORK_GROUP_JOB_TYPE_EMPLOYEES_REQUEST'
  } as const);

const fetchWorkGroupJobTypeEmployeesRequest = () =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEES_REQUEST'
  } as const);

const fetchWorkGroupJobTypeEmployeesSuccess = (payload: IWorkGroupJobTypeEmployee[], totalCount: number) =>
  ({
    type: 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchWorkGroupJobTypeEmployeesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_WORK_GROUP_JOB_TYPE_EMPLOYEES_FAILURE',
    error
  } as const;
};

export const fetchWorkGroupJobTypeEmployees = (
  organizationId: string,
  workGroupJobTypeId: string,
  top: number = 0,
  skip: number = 0,
  employeeName?: string | string[]
): ThunkAction<Promise<IWorkGroupJobTypeEmployee[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch((top === 0 ? fetchInitialWorkGroupJobTypeEmployeesRequest : fetchWorkGroupJobTypeEmployeesRequest)());

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('organizationId', Equals, organizationId)
            .filterBy('workGroupJobTypeId', Equals, workGroupJobTypeId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('employeeName', Contains, employeeName)
        )
        .orderBy('employeeName')
        .toQueryParam();

      const response = await axios.get<{ value: IWorkGroupJobTypeEmployee[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypeEmployees',
        { params }
      );
      const workGroupJobTypeContractorEmployees = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchWorkGroupJobTypeEmployeesSuccess(workGroupJobTypeContractorEmployees, totalCount));
      resolve(workGroupJobTypeContractorEmployees);
    } catch (error) {
      dispatch(fetchWorkGroupJobTypeEmployeesFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialWorkGroupJobTypeEmployeesRequest>
  | ReturnType<typeof fetchWorkGroupJobTypeEmployeesRequest>
  | ReturnType<typeof fetchWorkGroupJobTypeEmployeesSuccess>
  | ReturnType<typeof fetchWorkGroupJobTypeEmployeesFailure>;
