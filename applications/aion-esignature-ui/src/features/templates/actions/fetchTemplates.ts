import axios, { AxiosError } from 'axios';
import { ITemplate } from 'interfaces/template';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTemplatesRequest = () =>
  ({
    type: 'FETCH_TEMPLATES_REQUEST'
  } as const);

const fetchTemplatesSuccess = (payload: ITemplate[], totalCount: number) =>
  ({
    type: 'FETCH_TEMPLATES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchTemplatesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TEMPLATES_FAILURE',
    error
  } as const;
};

const shouldFetchTemplates = ({ templates: { isFetching } }: RootState) => !isFetching;

const fetchTemplates = (): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchTemplatesRequest());

    const { data } = await axios.get<{ value: ITemplate[]; '@odata.count': number }>('/api/v3.01/eSignatureTemplates');

    const templates = data.value;
    const totalCount = data['@odata.count'] !== undefined ? data['@odata.count'] : 0;

    dispatch(fetchTemplatesSuccess(templates, totalCount));
  } catch (error) {
    dispatch(fetchTemplatesFailure(error));
  }
};

export const fetchTemplatesIfNeeded = (): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchTemplates(getState())) {
    dispatch(fetchTemplates());
  }
};

export type Actions =
  | ReturnType<typeof fetchTemplatesRequest>
  | ReturnType<typeof fetchTemplatesSuccess>
  | ReturnType<typeof fetchTemplatesFailure>;
