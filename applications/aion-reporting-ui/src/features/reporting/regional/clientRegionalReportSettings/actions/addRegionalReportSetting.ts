import axios, { AxiosError } from 'axios';
import { IRegionalReportSetting } from 'interfaces/regionalReportSetting';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addRegionalReportSettingRequest = () =>
  ({
    type: 'ADD_REGIONAL_REPORT_SETTING_REQUEST'
  } as const);

const addRegionalReportSettingSuccess = (payload: IRegionalReportSetting) =>
  ({
    type: 'ADD_REGIONAL_REPORT_SETTING_SUCCESS',
    payload
  } as const);

const addRegionalReportSettingFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_REGIONAL_REPORT_SETTING_FAILURE',
    error
  } as const;
};

export const addRegionalReportSetting = (
  setting: Partial<IRegionalReportSetting>
): ThunkAction<Promise<IRegionalReportSetting>, RootState, null, Actions> => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(addRegionalReportSettingRequest());

      const { data } = await axios.post<IRegionalReportSetting>('/api/v3.01/regionalReportSettings', setting);

      dispatch(addRegionalReportSettingSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(addRegionalReportSettingFailure(error));
      reject(error);
    }
  });
};

export type Actions =
  | ReturnType<typeof addRegionalReportSettingRequest>
  | ReturnType<typeof addRegionalReportSettingSuccess>
  | ReturnType<typeof addRegionalReportSettingFailure>;
