import { Actions as FetchRegionalReportSettingsActions } from './actions/fetchRegionalReportSettings';
import { Actions as AddRegionalReportSettingActions } from './actions/addRegionalReportSetting';
import { Actions as UpdateRegionalReportSettingActions } from './actions/updateRegionalReportSetting';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IRegionalReportSetting } from 'interfaces/regionalReportSetting';

export type State = DeepReadonly<{
  isFetching: boolean;
  regionalReportSettings: IRegionalReportSetting[];
  error: AxiosError | null;
}>;

type Actions =
  | FetchRegionalReportSettingsActions
  | AddRegionalReportSettingActions
  | UpdateRegionalReportSettingActions;

export const initialState: State = {
  isFetching: false,
  regionalReportSettings: [],
  error: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'ADD_REGIONAL_REPORT_SETTING_REQUEST':
    case 'UPDATE_REGIONAL_REPORT_SETTING_REQUEST':
    case 'FETCH_REGIONAL_REPORT_SETTINGS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_REGIONAL_REPORT_SETTINGS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        regionalReportSettings: action.payload,
        error: null
      };
    case 'ADD_REGIONAL_REPORT_SETTING_SUCCESS':
      return {
        ...state,
        isFetching: false,
        regionalReportSettings: (state.regionalReportSettings || []).concat(action.payload),
        error: null
      };
    case 'UPDATE_REGIONAL_REPORT_SETTING_SUCCESS':
      return {
        ...state,
        error: null,
        isFetching: false,
        regionalReportSettings: state.regionalReportSettings.map(s => (s.id === action.payload.id ? action.payload : s))
      };
    case 'FETCH_REGIONAL_REPORT_SETTINGS_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}
