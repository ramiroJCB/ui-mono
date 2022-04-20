import axios, { AxiosError } from 'axios';
import { IRegionalReportSetting, RegionalReportSettingValue } from 'interfaces/regionalReportSetting';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const updateRegionalReportSettingRequest = () =>
  ({
    type: 'UPDATE_REGIONAL_REPORT_SETTING_REQUEST'
  } as const);

const updateRegionalReportSettingSuccess = (payload: IRegionalReportSetting) =>
  ({
    type: 'UPDATE_REGIONAL_REPORT_SETTING_SUCCESS',
    payload
  } as const);

const updateRegionalReportSettingFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'UPDATE_REGIONAL_REPORT_SETTING_FAILURE',
    error
  } as const;
};

export const updateRegionalReportSetting = (
  settingId: string,
  value: RegionalReportSettingValue
): ThunkAction<Promise<IRegionalReportSetting>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(updateRegionalReportSettingRequest());
      const { data } = await axios.patch<IRegionalReportSetting>(`/api/v3.01/regionalReportSettings(${settingId})`, [
        { op: 'replace', path: '/value', value }
      ]);
      dispatch(updateRegionalReportSettingSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(updateRegionalReportSettingFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof updateRegionalReportSettingRequest>
  | ReturnType<typeof updateRegionalReportSettingSuccess>
  | ReturnType<typeof updateRegionalReportSettingFailure>;
