import axios, { AxiosError } from 'axios';
import { IClientAssignedEmployee } from 'interfaces/clientAssignedEmployee';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialClientAssignedEmployeesRequest = () =>
  ({
    type: 'FETCH_INITIAL_CLIENT_ASSIGNED_EMPLOYEES_REQUEST'
  } as const);

const fetchClientAssignedEmployeesRequest = () =>
  ({
    type: 'FETCH_CLIENT_ASSIGNED_EMPLOYEES_REQUEST'
  } as const);

const fetchClientAssignedEmployeesSuccess = (payload: IClientAssignedEmployee[], totalCount: number) =>
  ({
    type: 'FETCH_CLIENT_ASSIGNED_EMPLOYEES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchClientAssignedEmployeesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CLIENT_ASSIGNED_EMPLOYEES_FAILURE',
    error
  } as const;
};

export const fetchClientAssignedEmployees = (
  organizationId: string,
  top: number = 0,
  skip: number = 0,
  name?: string | string[],
  employeeIds?: string
): ThunkAction<Promise<IClientAssignedEmployee[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch((top === 0 ? fetchInitialClientAssignedEmployeesRequest : fetchClientAssignedEmployeesRequest)());

      const { Contains, Equals, In } = OdataComparator;
      const params = new QueryBuilder()
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('organizationId', Equals, organizationId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('employeeName', Contains, name)
            .filterBy('employeeId', In, employeeIds && !Array.isArray(employeeIds) ? employeeIds.split(',') : undefined)
        )
        .orderBy('employeeName')
        .toQueryParam();

      const response = await axios.get<{ value: IClientAssignedEmployee[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/clientAssignedEmployees',
        { params }
      );

      const clientAssignedEmployees = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchClientAssignedEmployeesSuccess(clientAssignedEmployees, totalCount));
      resolve(clientAssignedEmployees);
    } catch (error) {
      dispatch(fetchClientAssignedEmployeesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialClientAssignedEmployeesRequest>
  | ReturnType<typeof fetchClientAssignedEmployeesRequest>
  | ReturnType<typeof fetchClientAssignedEmployeesSuccess>
  | ReturnType<typeof fetchClientAssignedEmployeesFailure>;
