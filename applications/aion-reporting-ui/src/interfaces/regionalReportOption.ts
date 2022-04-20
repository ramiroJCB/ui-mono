export enum RegionalReportOptionKey {
  IS_EDITABLE = 'IS_EDITABLE'
}

export interface IRegionalReportOption {
  key: RegionalReportOptionKey;
  displayName: string;

  // TODO: Make this an enum if we add other value types
  valueType: 'Boolean';
}
