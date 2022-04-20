import axios, { AxiosError } from 'axios';
import { IRegionalReportSetting } from 'interfaces/regionalReportSetting';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchRegionalReportSettingsRequest = () =>
  ({
    type: 'FETCH_REGIONAL_REPORT_SETTINGS_REQUEST'
  } as const);

const fetchRegionalReportSettingsSuccess = (payload: IRegionalReportSetting[]) =>
  ({
    type: 'FETCH_REGIONAL_REPORT_SETTINGS_SUCCESS',
    payload
  } as const);

const fetchRegionalReportSettingsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REGIONAL_REPORT_SETTINGS_FAILURE',
    error
  } as const;
};

const shouldFetchRegionalReportSettings = ({ regionalReportSettings: { isFetching } }: RootState) => !isFetching;

const fetchRegionalReportSettings = (
  organizationId: string
): ThunkAction<Promise<IRegionalReportSetting[]>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRegionalReportSettingsRequest());

      const response = await axios.get<{ value: IRegionalReportSetting[]; '@odata.count': number }>(
        '/api/v3.01/regionalReportSettings',
        {
          params: {
            $filter: `organizationId eq ${organizationId}`
          }
        }
      );

      const settings = response.data.value;

      dispatch(fetchRegionalReportSettingsSuccess(settings));
      resolve(settings);
    } catch (error) {
      dispatch(fetchRegionalReportSettingsFailure(error));
      reject(error);
    }
  });
};

export const fetchRegionalReportSettingsIfNeeded = (
  organizationId: string
): ThunkAction<void, RootState, null, Actions> => async (dispatch, getState) => {
  if (shouldFetchRegionalReportSettings(getState())) {
    dispatch(fetchRegionalReportSettings(organizationId));
  }
};

export type Actions =
  | ReturnType<typeof fetchRegionalReportSettingsRequest>
  | ReturnType<typeof fetchRegionalReportSettingsSuccess>
  | ReturnType<typeof fetchRegionalReportSettingsFailure>;
