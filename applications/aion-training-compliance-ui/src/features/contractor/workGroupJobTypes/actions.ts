import axios, { AxiosError } from 'axios';
import { IContractorWorkGroupJobType } from 'interfaces/contractorWorkGroupJobType';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchInitialContractorWorkGroupJobTypesRequest = () =>
  ({
    type: 'FETCH_INITIAL_CONTRACTOR_WORK_GROUP_JOB_TYPES_REQUEST'
  } as const);

const fetchContractorWorkGroupJobTypesRequest = () =>
  ({
    type: 'FETCH_CONTRACTOR_WORK_GROUP_JOB_TYPES_REQUEST'
  } as const);

const fetchContractorWorkGroupJobTypesSuccess = (payload: IContractorWorkGroupJobType[], totalCount: number) =>
  ({
    type: 'FETCH_CONTRACTOR_WORK_GROUP_JOB_TYPES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchContractorWorkGroupJobTypesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTOR_WORK_GROUP_JOB_TYPES_FAILURE',
    error
  } as const;
};

export const fetchContractorWorkGroupJobTypes = (
  workGroupId: string,
  organizationId: string,
  top: number = 0,
  skip: number = 0,
  jobTypeName?: string | string[]
): ThunkAction<Promise<IContractorWorkGroupJobType[]>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(
        (top === 0 ? fetchInitialContractorWorkGroupJobTypesRequest : fetchContractorWorkGroupJobTypesRequest)()
      );

      const { Contains, Equals } = OdataComparator;
      const params = new QueryBuilder()
        .expand('jobType')
        .top(top)
        .skip(skip)
        .filter(({ filterBy }) =>
          filterBy('workGroupId', Equals, workGroupId)
            .filterBy('contractorOrganizationId', Equals, organizationId)
            .filterBy('isDeleted', Equals, false)
            .filterBy('jobTypeName', Contains, jobTypeName)
        )
        .orderBy('jobTypeName')
        .toQueryParam();

      const response = await axios.get<{ value: IContractorWorkGroupJobType[]; '@odata.count': number }>(
        '/api/trainingCompliance/v3.01/workGroupJobTypeContractors',
        { params }
      );
      const contractorWorkGroupJobTypes = response.data.value;
      const totalCount = response.data['@odata.count'] !== undefined ? response.data['@odata.count'] : 0;

      dispatch(fetchContractorWorkGroupJobTypesSuccess(contractorWorkGroupJobTypes, totalCount));
      resolve(contractorWorkGroupJobTypes);
    } catch (error) {
      dispatch(fetchContractorWorkGroupJobTypesFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchInitialContractorWorkGroupJobTypesRequest>
  | ReturnType<typeof fetchContractorWorkGroupJobTypesRequest>
  | ReturnType<typeof fetchContractorWorkGroupJobTypesSuccess>
  | ReturnType<typeof fetchContractorWorkGroupJobTypesFailure>;
