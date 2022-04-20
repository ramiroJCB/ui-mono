import axios, { AxiosError } from 'axios';
import { AsyncResult } from 'react-select-async-paginate';
import { ITag } from 'interfaces/tag';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTagsRequest = () =>
  ({
    type: 'FETCH_TAGS_REQUEST'
  } as const);

const fetchTagsSuccess = (payload: ITag[], total: number, currentPage: number) =>
  ({
    type: 'FETCH_TAGS_SUCCESS',
    payload,
    total,
    currentPage
  } as const);

const fetchTagsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TAGS_FAILURE',
    error
  } as const;
};

const shouldFetchTags = ({ tags: { isFetching } }: RootState) => !isFetching;

export const fetchTags = (
  page: number = 1,
  top: number = 10,
  inputValue?: string
): ThunkAction<Promise<AsyncResult<OptionType, SelectAdditional>>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchTagsRequest());

      const $top = top;
      const params = inputValue && {
        $filter: `contains(tolower(name),'${inputValue.toLowerCase()}')`
      };

      const { data } = await axios.get<{ value: ITag[]; '@odata.count': number }>('/api/v3.00/tags', {
        params: {
          ...params,
          $orderby: 'name',
          $top,
          $skip: (page - 1) * $top
        }
      });
      const total = data['@odata.count'];

      dispatch(fetchTagsSuccess(data.value, total, page));
      resolve({
        options: data.value,
        hasMore: Math.ceil(total / top) > page,
        additional: { page: page + 1 }
      });
    } catch (error) {
      dispatch(fetchTagsFailure(error));
      reject(error);
    }
  });
};

export const fetchTagsIfNeeded = (
  page: number = 1,
  top: number = 10,
  inputValue?: string
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchTags(getState())) {
    dispatch(fetchTags(page, top, inputValue));
  }
};

export type Actions =
  | ReturnType<typeof fetchTagsRequest>
  | ReturnType<typeof fetchTagsSuccess>
  | ReturnType<typeof fetchTagsFailure>;
