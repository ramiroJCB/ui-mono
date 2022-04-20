import { IOrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';

export interface IOrganizationFeatureForm {
  feature: IOrganizationFeature;
  organizationType: OrganizationType | null;
}

export enum OrganizationType {
  Contractor = 'Contractor',
  Client = 'Client',
  All = 'All'
}
