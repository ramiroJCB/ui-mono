import { IRegionalReportSetting, RegionalReportSettingValue } from '../src/interfaces/regionalReportSetting';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';
import { RegionalReportOptionKey } from '../src/interfaces/regionalReportOption';

const { IS_EDITABLE } = RegionalReportOptionKey;

export const regionalReportSettings: { value: IRegionalReportSetting[] } = {
  value: [
    {
      id: 'ce3996f2-d41d-490a-9202-aec646a60bbf',
      organizationId: organizations[0].id,
      regionalReportOptionKey: IS_EDITABLE,
      value: RegionalReportSettingValue.True
    }
  ]
};
