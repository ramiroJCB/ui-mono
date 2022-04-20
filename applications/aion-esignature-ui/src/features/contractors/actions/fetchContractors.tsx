import axios, { AxiosError } from 'axios';
import { AssigneeGroupType } from '@pec/aion-ui-core/interfaces/assigneeGroup';
import { AsyncResult } from 'react-select-async-paginate';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { OdataParams } from '@pec/aion-ui-odata/types/odataParams';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const fetchContractorsRequest = () =>
  ({
    type: 'FETCH_CONTRACTORS_REQUEST'
  } as const);

const fetchContractorsSuccess = (payload: IOrganization[], total: number, currentPage: number) =>
  ({
    type: 'FETCH_CONTRACTORS_SUCCESS',
    payload,
    total,
    currentPage
  } as const);

const fetchContractorsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTORS_FAILURE',
    error
  } as const;
};

const shouldFetchContractors = ({ contractors: { isFetching } }: RootState) => !isFetching;

export const fetchContractors = (
  inputValue?: string,
  includeAllContractorsOption?: boolean,
  page: number = 1,
  top: number = 10,
  contractors?: IOrganization[]
): ThunkAction<Promise<AsyncResult<OptionType, SelectAdditional>>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchContractorsRequest());

      const $top = top;
      const params: OdataParams = { $orderby: 'name', $top };
      const { AllReleasedContractors } = AssigneeGroupType;
      const containsAllReleasedContractors = contractors && contractors.some(c => c.id === AllReleasedContractors);

      if (inputValue) {
        params.$filter = `contains(tolower(name),'${inputValue.toLowerCase()}')`;
      }

      if (contractors && !containsAllReleasedContractors) {
        params.$filter = `id in (${contractors.map(c => `'${c.id}'`).join(',')})`;
      }

      const { data } = await axios.get<{ value: IOrganization[]; '@odata.count': number }>('/api/v3.00/contractors', {
        params: { $skip: (page - 1) * $top, ...params }
      });

      const total = data['@odata.count'];
      let payload = data.value;

      if (!inputValue && total !== 0 && includeAllContractorsOption) {
        payload = [
          {
            id: AllReleasedContractors,
            name: i18next.t('eSignature.contractors.allReleasedContractors', 'All Released Contractors'),
            features: [],
            primaryAddress: '',
            secondaryAddress: '',
            state: '',
            city: '',
            country: '',
            zipCode: '',
            phoneNumber: '',
            phoneNumberExtension: '',
            emailAddress: '',
            clientFeatures: []
          },
          ...payload
        ];
      }

      dispatch(fetchContractorsSuccess(payload, total, page));
      resolve({
        options: payload,
        hasMore: Math.ceil(total / top) > page,
        additional: { page: page + 1 }
      });
    } catch (error) {
      dispatch(fetchContractorsFailure(error));
      reject();
    }
  });
};

export const fetchContractorsIfNeeded = (organizationId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchContractors(getState())) {
    dispatch(fetchContractors(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchContractorsRequest>
  | ReturnType<typeof fetchContractorsSuccess>
  | ReturnType<typeof fetchContractorsFailure>;
