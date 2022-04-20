export interface IEnvelopeLink {
  id: string;
  assignedExternalDocumentUrl: string;
  status: EnvelopeLinkStatus;
}

export enum EnvelopeLinkStatus {
  AssigneeAssigned = 'AssigneeAssigned'
}
