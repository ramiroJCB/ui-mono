import axios, { AxiosError } from 'axios';
import { ContractorParams } from 'types/contractorParams';
import { IContractor } from 'interfaces/contractor';
import { ITag } from 'interfaces/tag';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchContractorTagsRequest = () =>
  ({
    type: 'FETCH_CONTRACTOR_TAGS_REQUEST'
  } as const);

const fetchContractorTagsSuccess = (payload: IContractor[], total: number, currentPage: number) =>
  ({
    type: 'FETCH_CONTRACTOR_TAGS_SUCCESS',
    payload,
    total,
    currentPage
  } as const);

const fetchContractorTagsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_CONTRACTOR_TAGS_FAILURE',
    error
  } as const;
};

export const fetchContractorTags = (
  page: number = 1,
  top: number = 10,
  tags?: ITag[]
): ThunkAction<Promise<IContractor[]>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchContractorTagsRequest());

      const $top = top;
      const params: ContractorParams = { $orderby: 'name', $top };

      if (tags) {
        params.tagIds = tags.map(t => t.id).join(',');
      }

      const { data } = await axios.get<{ value: IContractor[]; '@odata.count': number }>('/api/v3.00/contractorTags', {
        params: { $skip: (page - 1) * $top, $expand: 'tags', ...params }
      });

      const total = data['@odata.count'];
      const payload = data.value;

      dispatch(fetchContractorTagsSuccess(payload, total, page));
      resolve(payload);
    } catch (error) {
      dispatch(fetchContractorTagsFailure(error));
      reject();
    }
  });
};

export type Actions =
  | ReturnType<typeof fetchContractorTagsRequest>
  | ReturnType<typeof fetchContractorTagsSuccess>
  | ReturnType<typeof fetchContractorTagsFailure>;
