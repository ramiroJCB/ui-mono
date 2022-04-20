export interface ISearchContractorsForm {
  keyword: string;
  city: string;
  state?: { value: string; label: string };
  distance?: { value: number | null | string; label: string };
  filters: ISearchContractorsFormFilters | null;
}

interface ISearchContractorsFormFilters {
  employeeCount?: { value: string; label: string };
  connectionStatus?: { value: string; label: string };
  naicsCode?: { value: string; label: string };
  tag?: { value: string; label: string };
  businessUnit?: { value: string; label: string };
  predictiveRanking?: { value: string; label: string };
}

export enum ConnectionStatus {
  Connected = 'Connected',
  NotConnected = 'NotConnected',
  Pending = 'Pending'
}
