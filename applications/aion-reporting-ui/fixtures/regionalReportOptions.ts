import { IRegionalReportOption, RegionalReportOptionKey } from '../src/interfaces/regionalReportOption';

const { IS_EDITABLE } = RegionalReportOptionKey;

export const regionalReportOptions: { value: IRegionalReportOption[] } = {
  value: [
    {
      key: IS_EDITABLE,
      displayName: 'Allow edits after submission deadline',
      valueType: 'Boolean'
    }
  ]
};
