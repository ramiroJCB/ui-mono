import axios, { AxiosError } from 'axios';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialContractorEmployeesRequest = () =>
  ({
    type: 'FETCH_INITIAL_CONTRACTOR_EMPLOYEES_REQUEST'
  } as const);

const fetchContractorEmployeesRequest = () =>
  ({
    type: 'FETCH_CONTRACTOR_EMPLOYEES_REQUEST'
  } as const);

const fetchContractorEmployeesSuccess = (payload: IWorkGroupJobTypeEmployee[], totalCount: number) =>
  ({
    type: 'FETCH_CONTRACTOR_EMPLOYEES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchContractorEmployeesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTOR_EMPLOYEES_FAILURE',
    error
  } as const;
};

export const fetchContractorEmployees = (
  organizationId: string,
  contractorId: string,
  top: number = 0,
  skip: number = 0
): ThunkAction<Promise<IWorkGroupJobTypeEmployee[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(top === 0 ? fetchInitialContractorEmployeesRequest() : fetchContractorEmployeesRequest());

      const { Equals } = OdataComparator;
      const params = new QueryBuilder()
        .skip(skip)
        .top(top)
        .filter(({ filterBy }) =>
          filterBy('organizationId', Equals, organizationId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('contractorId', Equals, contractorId)
        )
        .orderBy('employeeName')
        .toQueryParam();

      var response = await axios.get<{ value: IWorkGroupJobTypeEmployee[]; '@odata.count': number }>(
        '/api/trainingCompliance/V3.01/clientAssignedEmployees',
        { params }
      );

      const contractorEmployees = response.data.value;
      const totalCount = response.data['@odata.count'];

      dispatch(fetchContractorEmployeesSuccess(contractorEmployees, totalCount));
      resolve(contractorEmployees);
    } catch (error) {
      dispatch(fetchContractorEmployeesFailure(error));
      reject();
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialContractorEmployeesRequest>
  | ReturnType<typeof fetchContractorEmployeesRequest>
  | ReturnType<typeof fetchContractorEmployeesSuccess>
  | ReturnType<typeof fetchContractorEmployeesFailure>;
