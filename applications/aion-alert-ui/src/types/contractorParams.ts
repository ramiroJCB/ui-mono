import { OdataParams } from '@pec/aion-ui-odata/types/odataParams';

export type ContractorParams = OdataParams & {
  orContractors?: string;
  orTags?: string;
  tagIds?: string;
};
