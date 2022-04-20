import axios, { AxiosError } from 'axios';
import { IRegionalReportOption } from 'interfaces/regionalReportOption';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRegionalReportOptionsRequest = () =>
  ({
    type: 'FETCH_REGIONAL_REPORT_OPTIONS_REQUEST'
  } as const);

const fetchRegionalReportOptionsSuccess = (payload: IRegionalReportOption[]) =>
  ({
    type: 'FETCH_REGIONAL_REPORT_OPTIONS_SUCCESS',
    payload
  } as const);

const fetchRegionalReportOptionsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONAL_REPORT_OPTIONS_FAILURE',
    error
  } as const;
};

const shouldFetchRegionalReportOptions = ({ regionalReportOptions: { isFetching } }: RootState) => !isFetching;

const fetchRegionalReportOptions = (): ThunkAction<
  Promise<IRegionalReportOption[]>,
  RootState,
  null,
  Actions
> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionalReportOptionsRequest());

      const response = await axios.get<{ value: IRegionalReportOption[]; '@odata.count': number }>(
        '/api/v3.01/regionalReportOptions'
      );

      const options = response.data.value;

      dispatch(fetchRegionalReportOptionsSuccess(options));
      resolve(options);
    } catch (error) {
      dispatch(fetchRegionalReportOptionsFailure(error));
      reject(error);
    }
  });
};

export const fetchRegionalReportOptionsIfNeeded = (): ThunkAction<void, RootState, null, Actions> => async (
  dispatch,
  getState
) => {
  if (shouldFetchRegionalReportOptions(getState())) {
    dispatch(fetchRegionalReportOptions());
  }
};

export type Actions =
  | ReturnType<typeof fetchRegionalReportOptionsRequest>
  | ReturnType<typeof fetchRegionalReportOptionsSuccess>
  | ReturnType<typeof fetchRegionalReportOptionsFailure>;
