import { _DeepReadonlyObject } from 'utility-types/dist/mapped-types';

export interface IProgramStatusFormFilters {
  beginDateUtc: string;
  endDateUtc: string;
  isForAllClients: boolean;
  clients:
    | _DeepReadonlyObject<{
        createdBy: string;
        createdDateUtc: string;
        id: string;
        mandateCount: number;
        name: string;
        updatedBy: string;
        updatedDateUtc: string;
      }>[]
    | undefined;
  timezone: string;
}
