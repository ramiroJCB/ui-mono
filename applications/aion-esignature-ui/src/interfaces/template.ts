export interface ITemplate {
  id: string;
  name: string;
  externalTemplateId: string;
  ownerType: TemplateOwnerType;
  ownerTypeId: string;
  createdBy: string;
  createDateUtc: string;
}

export enum TemplateOwnerType {
  Organization = 'Organization'
}
