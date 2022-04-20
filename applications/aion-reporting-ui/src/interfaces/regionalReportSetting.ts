import { RegionalReportOptionKey } from './regionalReportOption';

export enum RegionalReportSettingValue {
  True = 'true',
  False = 'false'
}

export interface IRegionalReportSetting {
  id: string;
  organizationId: string;
  regionalReportOptionKey: RegionalReportOptionKey;
  value: RegionalReportSettingValue;
}
